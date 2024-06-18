import mongoose from 'mongoose';
import mongooseConfig from './config';
import logger from '../../utils/logging/winstonLogger';

export default async function connectToMongoDb() {
	if (!mongooseConfig.uri) {
		throw new Error('Invalid mongo db connection string');
	}
	try {
		await mongoose.connect(mongooseConfig.uri, mongooseConfig.options);

		logger.info('Mongoose connected successfully');
	} catch (err) {
		logger.info('Mongoose connection error\n', { file: __filename });
		process.exit(1);
	}
}
