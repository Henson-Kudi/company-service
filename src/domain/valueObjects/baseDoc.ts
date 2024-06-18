import { modelOptions } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import mongoose, { Types } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface BaseDocument extends Base<mongoose.Types.ObjectId> {}

@modelOptions({
	schemaOptions: {
		virtuals: true,
		toJSON: {
			virtuals: true
		},
		toObject: {
			virtuals: true
		}
	}
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class BaseDocument extends TimeStamps {
	constructor() {
		super();
		const ID = new Types.ObjectId();
		this._id = ID;
		this.id = ID.toString();
	}
}

export default BaseDocument;
