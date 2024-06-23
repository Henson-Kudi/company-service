import envConf from './infrastructure/config/env.conf';
import connectToMongoDb from './infrastructure/databases/mongodb/index.db';
import RabbitMq, {
	listenForConnectionFailures
} from './infrastructure/providers/config/rabbitMq/connection';
import MessagingProvider from './infrastructure/providers/messagingProvider';
import logger from './infrastructure/utils/logging/winstonLogger';
import startServer from './presentation/express/settings/server';

(async () => {
	// Ensure mongodb is connected
	await connectToMongoDb();
	// ensure rabbitMq is connected
	const rabbitMqConnection = await new RabbitMq().connect();

	// Listen for failure events on rabbit mq
	listenForConnectionFailures(rabbitMqConnection);

	const messagingProvider = new MessagingProvider(rabbitMqConnection);

	// Start server
	startServer(messagingProvider);
})()
	.then(() => logger.info('App up and running'))
	.catch((err) => {
		logger.error(err);
		envConf.NODE_ENV !== 'dev' && process.exit(1);
	});
