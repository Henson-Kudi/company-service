import { Types } from 'mongoose';

export default class DataUpdatedDTO<T> {
	constructor(
		public id: Types.ObjectId,
		public update: T
	) {}
}
