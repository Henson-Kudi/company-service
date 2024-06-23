import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../adapters/expressAdapter';
import createCompanyComposer from '../../../../infrastructure/services/composers/company/CreateCompany';
import IMessagingProvider from '../../../../application/providers/messaging.provider';

export default function createCompanyHandler(
	messagingProvider: IMessagingProvider
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const response = await expressAdapter(
				req,
				createCompanyComposer(messagingProvider)
			);

			res.status(response.code).json(response);
			next();
		} catch (err) {
			next(err);
		}
	};
}
