import Joi from '@hapi/joi';
import ICreateCompanyUseCase from '../../../../application/use-cases/interfaces/ICreateCommpany';
import ICreateCompanyDTO from '../../../../domain/dtos/CreateCompanyDTO';
import ResponseCodes from '../../../../domain/enums/ResponseCodes';
import CustomError from '../../../../domain/errors/CustomError';
import IHttpRequest from '../../helpers/IHttpRequest';
import IHttpResponse from '../../helpers/IHttpResponse';
import HttpResponse from '../../helpers/implementations/HttpResponse';
import IContoller from '../IController';
import CreateCompanySchema from '../../../../domain/schemas/Company.schema';
import validateJoiSchemaAsync from '../../../../infrastructure/utils/validateJoiSchema';

export default class CreateCompanyController implements IContoller {
	constructor(private useCase: ICreateCompanyUseCase) {}

	async handle(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			const data: ICreateCompanyDTO = request.body as ICreateCompanyDTO;

			// Validate request body with joi before creating document
			await validateJoiSchemaAsync(CreateCompanySchema, data);

			const response = await this.useCase.execute(data);

			return new HttpResponse(ResponseCodes.Success, { data: response });
		} catch (err) {
			if (err instanceof CustomError) {
				return new HttpResponse(err.code, { error: err });
			} else if (err instanceof Joi.ValidationError) {
				return new HttpResponse(ResponseCodes.ValidationError, {
					error: new CustomError(
						err?.message,
						ResponseCodes.ValidationError,
						err?.details
					)
				});
			} else {
				return new HttpResponse(ResponseCodes.ServerError, {
					error: err as CustomError
				});
			}
		}
	}
}
