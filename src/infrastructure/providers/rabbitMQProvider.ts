import { Connection, ConsumeMessage, Options } from "amqplib";
import IRabbitMQProvider from "../../application/providers/RabbitMq.provider";

export default class RabbitMQProvider implements IRabbitMQProvider {
    constructor(private connection: Connection) { }

    publishMessage(config: { exchange: string; exchangeType: "direct" | "fanout" | "topic"; routeKey: string; task: Buffer; options?: { assert?: Options.AssertExchange; publish?: Options.Publish; }; } | { queue: string; task: Buffer; options?: { assert?: Options.AssertQueue; publish?: Options.Publish; }; }): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    
    registerConsumer(config: { exchange?: string; exchangeType?: "direct" | "fanout" | "topic"; queueName?: string; routingKey?: string; options?: { assertExchange?: Options.AssertExchange; assertQueue?: Options.AssertQueue; }; }, msgConsumer: (msq: ConsumeMessage, attempts?: number) => Promise<unknown>): void {
        throw new Error("Method not implemented.");
    }
}