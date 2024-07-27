import { Router } from 'express';
import IMessagingProvider from '../../../application/providers/messaging.provider';
import createCompanyHandler from './handlers/createCompanyHandler';
import updateCompanyHandler from './handlers/updateCompanyHandler';
import updateCompanySubscriptionHandler from './handlers/updateCompanySubscription';
import deleteCompanyHandler from './handlers/deleteCompanyHandler';
import getCompanyHandler from './handlers/getCompanyHandler';
import getCompaniesHandler from './handlers/getCompanies';

export default function companyRoutes(
	messagingProvider: IMessagingProvider
): Router {
	const router = Router();


	router.route('/').post(createCompanyHandler(messagingProvider)).get(getCompaniesHandler());

	// Need to implement middleware that allows only company owner (creator of company) to edit details about company (update/delete/get)

	router.route('/:id').put(updateCompanyHandler(messagingProvider)).delete(deleteCompanyHandler(messagingProvider)).get(getCompanyHandler());
	router.put('/:id/subscription', updateCompanySubscriptionHandler(messagingProvider));

	return router;
}
