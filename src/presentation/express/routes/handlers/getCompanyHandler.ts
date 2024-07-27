import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../adapters/expressAdapter';
import getCompanyComposer from '../../../../infrastructure/services/composers/company/getCompany';

export default function getCompanyHandler() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await expressAdapter(
                req,
                getCompanyComposer()
            );

            res.status(response.code).json(response);
            next();
        } catch (err) {
            next(err);
        }
    };
}
