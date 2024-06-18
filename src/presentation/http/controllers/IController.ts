import IHttpRequest from '../helpers/IHttpRequest';
import IHttpResponse from '../helpers/IHttpResponse';

export default interface IContoller {
	handle(request: IHttpRequest): Promise<IHttpResponse>;
}
