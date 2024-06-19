import { Channel, Connection, ConsumeMessage, Options } from 'amqplib';
import IRabbitMQProvider, {
    QueueConfig,
    ExchangeConfiq
} from '../../application/providers/RabbitMq.provider';
import logger from '../utils/logging/winstonLogger';
import rabbitMqQueues from '../../domain/valueObjects/rabbitMqQueues';

export default class RabbitMQProvider implements IRabbitMQProvider {
    constructor(private connection: Connection) { }

    async publishMessage(to: 'queue', config: QueueConfig): Promise<boolean>;
    async publishMessage(
        to: 'exchange',
        config: ExchangeConfiq
    ): Promise<boolean>;

    async publishMessage(
        to: 'queue' | 'exchange',
        config: QueueConfig | ExchangeConfiq
    ): Promise<boolean> {
        let channel: Channel | undefined;

        try {
            const conn = this.connection;

            channel = await conn.createChannel();

            let Published: boolean = false;

            if (to === 'exchange') {
                const { exchange, exchangeType, routeKey, task, options } =
                    config as ExchangeConfiq;

                await channel.assertExchange(exchange, exchangeType, {
                    ...options?.assert,
                    durable: options?.assert?.durable ?? true
                });

                const published = channel.publish(exchange, routeKey, task, {
                    ...options?.publish,
                    persistent: options?.publish?.persistent ?? true
                });

                Published = published;
            } else if (to === 'queue') {
                const { queue, task, options } = config as QueueConfig;
                await channel.assertQueue(queue, {
                    ...options?.assert,
                    durable: options?.assert?.durable ?? true
                });

                const published = channel.sendToQueue(queue, task, {
                    ...options?.publish,
                    persistent: options?.publish?.persistent ?? true
                });

                Published = published;
            }

            return Published;
        } catch (err) {
            logger.error(err);
            return false;
        }
    }

    async registerConsumer(
        config: {
            exchange?: string;
            exchangeType?: 'direct' | 'fanout' | 'topic';
            queueName?: string;
            routingKey?: string;
            options?: {
                assertExchange?: Options.AssertExchange;
                assertQueue?: Options.AssertQueue;
            };
        },
        msgConsumer: (msq: ConsumeMessage, attempts?: number) => Promise<unknown>
    ): Promise<void> {
        const connection = this.connection;
        try {
            const channel = await connection.createChannel();

            if (config.exchange) {
                await channel.assertExchange(
                    config?.exchange,
                    config?.exchangeType ?? 'direct',
                    {
                        ...config?.options?.assertExchange,
                        durable: config?.options?.assertExchange?.durable ?? true
                    }
                );
            }

            const queueParams: Options.AssertQueue = config?.queueName
                ? {
                    ...config?.options?.assertQueue,
                    durable: config?.options?.assertQueue?.durable ?? true
                }
                : {
                    ...config?.options?.assertQueue,
                    exclusive: config?.options?.assertQueue?.exclusive ?? true
                };

            const queue = await channel.assertQueue(
                config?.queueName ?? '',
                queueParams
            );

            // Only bind routing key if exchange is  passed as well since it is a required field
            if (config?.routingKey && config?.exchange) {
                await channel.bindQueue(
                    config?.queueName ?? queue.queue,
                    config?.exchange,
                    config?.routingKey
                );
            }

            // process the message
            // We need to ensure that when consuming a message, if there is a replyTo Key, we need to reply to that queue with the processed data
            channel.consume(config?.queueName ?? queue.queue, async (msg) => {
                if (!msg) {
                    return;
                }
                try {
                    if (msg?.content) {
                        const data = await msgConsumer(msg, 1);

                        // We need to reply to the sender if they provide a reply url or queue.
                        // We'll only reply to messages with a correlationId. Thus any request made without a correlationId but replyTo field, will not get any response
                        if (msg.properties.replyTo && msg.properties.correlationId) {
                            channel.sendToQueue(
                                msg.properties.replyTo,
                                Buffer.from(JSON.stringify(data)),
                                {
                                    correlationId: msg.properties.correlationId
                                }
                            );
                        }

                        channel.ack(msg);
                    }
                } catch (err) {
                    console.log(err);
                    // SEND MESSAGE TO DEAD LETTER QUEUE SINCE IT CANNOT BE PROCESSED
                    channel.sendToQueue(rabbitMqQueues.DEAD_LETTER.name, msg.content);

                    channel.ack(msg);
                    // SEND MESSAGE TO SLACK TO VERIFY ERROR
                }
            });
        } catch (err) {
            throw err;
        }
    }
}
