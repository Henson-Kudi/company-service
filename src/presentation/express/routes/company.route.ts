import { Router } from 'express';
import IRabbitMQProvider from '../../../application/providers/RabbitMq.provider';
import expressAdapter from '../../adapters/expressAdapter';
import createCompanyComposer from '../../../infrastructure/services/composers/company/CreateCompany';

export default function companyRoutes(
	rabbitMQProvider: IRabbitMQProvider
): Router {
	const router = Router();

	router.route('/').post(async (req, res, next) => {
		try {
			const response = await expressAdapter(
				req,
				createCompanyComposer(rabbitMQProvider)
			);

			res.status(response.code).json(response);
			next();
		} catch (err) {
			next(err);
		}
	});

	return router;
}
