import { Router } from 'express';
import IMessagingProvider from '../../../application/providers/messaging.provider';
import createCompanyHandler from './handlers/createCompanyHandler';
import updateCompanyHandler from './handlers/updateCompanyHandler';
import updateCompanySubscriptionHandler from './handlers/updateCompanySubscription';

export default function companyRoutes(
	messagingProvider: IMessagingProvider
): Router {
	const router = Router();


	router.route('/').post(createCompanyHandler(messagingProvider));

	// Need to implement middleware that allows only company owner (creatore of companny) to edit details about company (update/delete/get)

	router.route('/:id').put(updateCompanyHandler(messagingProvider));
	router.put('/:id/subscription', updateCompanySubscriptionHandler(messagingProvider));

	return router;
}
