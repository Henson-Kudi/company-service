import { ConsumeMessage, Options } from 'amqplib';

type ExchangeTypes = 'direct' | 'fanout' | 'topic';

export interface ExchangeConfiq {
	exchange: string;
	exchangeType: ExchangeTypes;
	routeKey: string;
	task: Buffer;
	options?: {
		assert?: Options.AssertExchange;
		publish?: Options.Publish;
	};
}

export interface QueueConfig {
	queue: string;
	task: Buffer;
	options?: {
		assert?: Options.AssertQueue;
		publish?: Options.Publish;
	};
}

export default interface IMessagingProvider {
	publishMessage(to: 'exchange', config: ExchangeConfiq): Promise<boolean>;

	publishMessage(to: 'queue', config: QueueConfig): Promise<boolean>;

	registerConsumer(
		config: {
			exchange?: string;
			exchangeType?: ExchangeTypes;
			queueName?: string;
			routingKey?: string;
			options?: {
				assertExchange?: Options.AssertExchange;
				assertQueue?: Options.AssertQueue;
			};
		},
		msgConsumer: (msq: ConsumeMessage, attempts?: number) => Promise<unknown>
	): void;
}
