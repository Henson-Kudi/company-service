import Joi from '@hapi/joi';
import IUpdateCompanyUseCase from '../../../../application/use-cases/interfaces/IUpdateCompany';
import IUpdateCompany from '../../../../domain/dtos/UpdateCompanyDTO';
import ResponseCodes from '../../../../domain/enums/ResponseCodes';
import CustomError from '../../../../domain/errors/CustomError';
import IHttpRequest from '../../helpers/IHttpRequest';
import IHttpResponse from '../../helpers/IHttpResponse';
import HttpResponse from '../../helpers/implementations/HttpResponse';
import IContoller from '../IController';
import { isValidObjectId, Types } from 'mongoose';
import { UpdateCompanySchema } from '../../../../domain/schemas/Company.schema';
import validateJoiSchemaAsync from '../../../../infrastructure/utils/validateJoiSchema';

export default class UpdateCompanyController implements IContoller {
	constructor(private useCase: IUpdateCompanyUseCase<IUpdateCompany>) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const data: IUpdateCompany = request.body as IUpdateCompany;

			const companyId = request.params.id;

			if (!companyId || !isValidObjectId(companyId)) {
				return new HttpResponse(ResponseCodes.BadRequest, {
					error: new CustomError('Invalid company id', ResponseCodes.BadRequest)
				});
			}

			// Validate update company schema
			await validateJoiSchemaAsync<IUpdateCompany>(UpdateCompanySchema, data);

			const response = await this.useCase.execute(
				Types.ObjectId.createFromHexString(companyId),
				data
			);

			return new HttpResponse(ResponseCodes.Success, { data: response });
		} catch (err) {
			if (err instanceof CustomError) {
				return new HttpResponse(err.code, { error: err.toJSON() });
			} else if (err instanceof Joi.ValidationError) {
				return new HttpResponse(ResponseCodes.ValidationError, {
					error: new CustomError(
						err?.message,
						ResponseCodes.ValidationError,
						err?.details
					).toJSON()
				});
			} else {
				return new HttpResponse(ResponseCodes.ServerError, {
					error: err as CustomError
				});
			}
		}
	}
}
