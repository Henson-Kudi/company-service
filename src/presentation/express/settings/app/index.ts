import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import IRabbitMQProvider from '../../../../application/providers/RabbitMq.provider';
import companyRoutes from '../../routes/company.route';

export default function initialiseApp(
	rabbitMQProvider: IRabbitMQProvider
): express.Application {
	const app = express();

	app.use(cors({ origin: '*' }));

	app.use(express.json());

	app.use(morgan('dev'));

	app.use('/api/v1/companies', companyRoutes(rabbitMQProvider));

	return app;
}
