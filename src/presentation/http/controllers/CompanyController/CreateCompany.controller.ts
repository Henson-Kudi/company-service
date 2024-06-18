import Joi from '@hapi/joi';
import ICreateCompanyUseCase from '../../../../application/use-cases/interfaces/ICreateCommpany';
import ICreateCompanyDTO from '../../../../domain/dtos/CreateUser';
import ResponseCodes from '../../../../domain/enums/ResponseCodes';
import CustomError from '../../../../domain/errors/CustomError';
import IHttpRequest from '../../helpers/IHttpRequest';
import IHttpResponse from '../../helpers/IHttpResponse';
import HttpResponse from '../../helpers/implementations/HttpResponse';
import IContoller from '../IController';

export default class CreateCompanyController implements IContoller {
    constructor(private useCase: ICreateCompanyUseCase) { }

    async handle(request: IHttpRequest): Promise<IHttpResponse> {
        try {
            const data: ICreateCompanyDTO = request.body as ICreateCompanyDTO;

            // Maybe we need to validate request body with joi schemas here as well

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
