import { Request, Response } from 'express';
import HttpResponse from '../../http/helpers/implementations/HttpResponse';
import ResponseCodes from '../../../domain/enums/ResponseCodes';
import CustomError from '../../../domain/errors/CustomError';

export default function responseHandler(
	err: Error,
	req: Request,
	res: Response
) {
	if (err instanceof HttpResponse) {
		return res.status(err.code).json(err);
	} else {
		return res.status(ResponseCodes.ServerError).json(
			new HttpResponse(ResponseCodes.ServerError, {
				error: new CustomError(err?.message, ResponseCodes.ServerError, err)
			})
		);
	}
}
