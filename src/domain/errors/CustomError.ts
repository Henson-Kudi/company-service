import ResponseCodes from '../enums/ResponseCodes';

export default class CustomError extends Error {
	constructor(
		message: string,
		public code: ResponseCodes,
		public data?: unknown
	) {
		super(message);
		this.name = 'Error';
		// Capture stack trace, excluding the constructor call from it.
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, CustomError);
		} else {
			this.stack = new Error(message).stack;
		}
	}

	toJSON() {
		return {
			message: this.message,
			code: this.code,
			data: this?.data,
			name: this.name,
			stack: this.stack
		};
	}
}
