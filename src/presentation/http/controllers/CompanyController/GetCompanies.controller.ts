import ResponseCodes from '../../../../domain/enums/ResponseCodes';
import CustomError from '../../../../domain/errors/CustomError';
import IHttpRequest from '../../helpers/IHttpRequest';
import IHttpResponse from '../../helpers/IHttpResponse';
import HttpResponse from '../../helpers/implementations/HttpResponse';
import IContoller from '../IController';
import IGetCompanies from '../../../../application/use-cases/interfaces/IGetCompanies';

export default class GetCompaniesController implements IContoller {
    constructor(
        private useCase: IGetCompanies
    ) { }

    async handle(request: IHttpRequest): Promise<IHttpResponse> {
        try {
            const response = await this.useCase.execute(request.query);

            return new HttpResponse(ResponseCodes.Success, { data: response });
        } catch (err) {
            if (err instanceof CustomError) {
                return new HttpResponse(err.code, { error: err.toJSON() });
            } else {
                return new HttpResponse(ResponseCodes.ServerError, {
                    error: err as CustomError
                });
            }
        }
    }
}
