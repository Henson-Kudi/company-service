import { Server } from 'http';
import IMessagingProvider from '../../../application/providers/messaging.provider';
import initialiseApp from './app';
import envConf from '../../../infrastructure/config/env.conf';
import logger from '../../../infrastructure/utils/logging/winstonLogger';

export default function startServer(
	messagingProvider: IMessagingProvider
): Server {
	const app = initialiseApp(messagingProvider);

	const server = app.listen(envConf.serverPort, () =>
		logger.info(`Server running on: http://localhost:${envConf.serverPort}`)
	);

	return server;
}
