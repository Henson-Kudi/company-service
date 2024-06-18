import ResponseCodes from '../../../../domain/enums/ResponseCodes';
import CustomError from '../../../../domain/errors/CustomError';
import IHttpResponse from '../IHttpResponse';

export default class HttpResponse implements IHttpResponse {
	constructor(
		public code: ResponseCodes,
		public data: {
			error?: CustomError;
			data?: unknown;
		}
	) {
		if (this.data.data) {
			this.success = true;
		} else {
			this.success = false;
		}
	}
	success!: boolean;
}
