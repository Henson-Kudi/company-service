import mongoose from 'mongoose';
import envConf from '../../config/env.conf';

const mongooseConfig: {
	uri: string;
	options?: mongoose.ConnectOptions;
} = {
	uri: envConf.mongo.uri,
	options: {}
};

export default mongooseConfig;
