import ResponseCodes from '../../../../domain/enums/ResponseCodes';
import CustomError from '../../../../domain/errors/CustomError';
import IHttpRequest from '../../helpers/IHttpRequest';
import IHttpResponse from '../../helpers/IHttpResponse';
import HttpResponse from '../../helpers/implementations/HttpResponse';
import IContoller from '../IController';
import mongoose, { isValidObjectId } from 'mongoose';
import IGetCompany from '../../../../application/use-cases/interfaces/IGetCompany';

export default class GetCompanyController implements IContoller {
    constructor(
        private useCase: IGetCompany
    ) { }

    async handle(request: IHttpRequest): Promise<IHttpResponse> {
        try {

            const companyId = request.params.id;

            if (!companyId || !isValidObjectId(companyId)) {
                return new HttpResponse(ResponseCodes.BadRequest, {
                    error: new CustomError('Invalid company id', ResponseCodes.BadRequest)
                });
            }

            const response = await this.useCase.execute(
                mongoose.Types.ObjectId.createFromHexString(companyId.toString
                    ()
                )
            );

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
