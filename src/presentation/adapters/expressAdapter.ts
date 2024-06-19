import IContoller from '../http/controllers/IController';
import IHttpRequest from '../http/helpers/IHttpRequest';
import IHttpResponse from '../http/helpers/IHttpResponse';

export default async function expressAdapter(
	httpRequest: IHttpRequest,
	handler: IContoller
): Promise<IHttpResponse> {
	const response = await handler.handle(httpRequest);
	return response;
}
