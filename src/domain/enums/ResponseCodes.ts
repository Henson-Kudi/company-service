enum ResponseCodes {
	BadRequest = 400,
	UnAuthorised = 401,
	Forbidden = 403,
	NotFound = 404,
	RequestTimeOutError = 408,
	ValidationError = 422,

	ServerError = 500,
	GatewayTimeOut = 502,
	ServerDown = 503,

	Success = 201
}

export default ResponseCodes;
