import { NextFunction, Request, Response } from 'express';
import IMessagingProvider from '../../../../application/providers/messaging.provider';
import expressAdapter from '../../../adapters/expressAdapter';
import updateCompanySubscriptionComposer from '../../../../infrastructure/services/composers/company/UpdateCompanySubscriptionComposer';

export default function updateCompanySubscriptionHandler(
	messagingProvider: IMessagingProvider
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const response = await expressAdapter(
				req,
				updateCompanySubscriptionComposer(messagingProvider)
			);

			return res.status(response.code).json(response);
		} catch (err) {
			next(err);
		}
	};
}
