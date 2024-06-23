import { NextFunction, Request, Response } from 'express';
import IMessagingProvider from '../../../../application/providers/messaging.provider';
import expressAdapter from '../../../adapters/expressAdapter';
import updateCompanyComposer from '../../../../infrastructure/services/composers/company/UpdateCompanyComposer';

export default function updateCompanyHandler(
    messagingProvider: IMessagingProvider
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await expressAdapter(
                req,
                updateCompanyComposer(messagingProvider)
            );

            return res.status(response.code).json(response);
        } catch (err) {
            next(err);
        }
    };
}
