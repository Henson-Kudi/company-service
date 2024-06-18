// Config file for all environment variables
import 'dotenv/config';

export default {
	mongo: {
		uri: process.env.MONGO_URI || ''
	},
	serverPort: process.env.PORT || 5003,
	NODE_ENV: process.env.NODE_ENV || 'dev',
	rabbitMqConnectionString: process.env.RABBIT_MQ_CONNECTION_STRING || ''
};
