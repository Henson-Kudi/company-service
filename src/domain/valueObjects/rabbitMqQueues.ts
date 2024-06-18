export default Object.freeze({
	DEAD_LETTER: {
		name: 'DEAD_LETTER-EXCHANGE'
	},
	AUTHENTICATION_EXCHANGE: {
		name: 'authentication-exchange',
		routeKeys: {
			accountCreated: 'account.created',
			accountUpdated: 'account.updated',
			accountDeleted: 'account.deleted'
		}
	},
	COMPANY_EXCHANGE: {
		name: 'company-exchange',
		routeKeys: {
			companyCreated: 'company.created',
			companyUpdated: 'company.updated',
			companyDeleted: 'company.deleted'
		}
	},
	AUTH_QUEUES: {
		authenticateJwt: 'authenticate-jwt'
	}
});
