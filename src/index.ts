import connectToMongoDb from "./infrastructure/databases/mongodb/index.db";
import RabbitMq, { listenForConnectionFailures } from "./infrastructure/providers/config/rabbitMq/connection";
import RabbitMQProvider from "./infrastructure/providers/rabbitMQProvider";
import startServer from "./presentation/express/settings/server";

(async () => {
    // Ensure mongodb is connected
    await connectToMongoDb()
    // ensure rabbitMq is connected
    const rabbitMqConnection = await new RabbitMq().connect()

    // Listen for failure events on rabbit mq
    listenForConnectionFailures(rabbitMqConnection)

    const rabbitMqProvider = new RabbitMQProvider(rabbitMqConnection)

    // Start server
    startServer(rabbitMqProvider)



})()