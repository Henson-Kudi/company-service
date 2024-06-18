import ResponseCodes from '../../../domain/enums/ResponseCodes';
import CustomError from '../../../domain/errors/CustomError';

type IHttpResponse = {
	code: ResponseCodes;
	data: {
		error?: CustomError;
		data?: unknown;
	};
	success: boolean;
};

export default IHttpResponse;
