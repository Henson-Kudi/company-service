import { NextFunction, Request, Response } from 'express';
import expressAdapter from '../../../adapters/expressAdapter';
import getCompaniesComposer from '../../../../infrastructure/services/composers/company/getCompanies';

export default function getCompaniesHandler() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await expressAdapter(
                req,
                getCompaniesComposer()
            );

            res.status(response.code).json(response);
            next();
        } catch (err) {
            next(err);
        }
    };
}
