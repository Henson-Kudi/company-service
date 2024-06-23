import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import IMessagingProvider from '../../../../application/providers/messaging.provider';
import companyRoutes from '../../routes/company.route';

export default function initialiseApp(
	messagingProvider: IMessagingProvider
): express.Application {
	const app = express();

	app.use(cors({ origin: '*' }));

	app.use(express.json());

	app.use(morgan('dev'));

	app.use('/api/v1/companies', companyRoutes(messagingProvider));

	return app;
}
