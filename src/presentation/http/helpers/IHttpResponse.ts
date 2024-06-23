import ResponseCodes from '../../../domain/enums/ResponseCodes';

type IHttpResponse = {
	code: ResponseCodes;
	data: {
		error?: unknown;
		data?: unknown;
	};
	success: boolean;
};

export default IHttpResponse;
