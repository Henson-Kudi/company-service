import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../adapters/expressAdapter';
import IMessagingProvider from '../../../../application/providers/messaging.provider';
import deleteCompanyComposer from '../../../../infrastructure/services/composers/company/DeleteCompany';

export default function deleteCompanyHandler(
    messagingProvider: IMessagingProvider
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await expressAdapter(
                req,
                deleteCompanyComposer(messagingProvider)
            );

            res.status(response.code).json(response);
            next();
        } catch (err) {
            next(err);
        }
    };
}
