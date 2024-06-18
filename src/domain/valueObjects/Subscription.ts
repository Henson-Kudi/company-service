import { prop } from '@typegoose/typegoose';
import SubscriptionPackage from '../enums/SubscriptionPackage';

interface ISubscription {
	pakage: SubscriptionPackage;
	start: Date;
	end: Date;
}

export default class Subscription implements ISubscription {
	constructor(
		packageType: SubscriptionPackage,
		startDate: Date,
		endDate: Date
	) {
		endDate && (this.end = endDate);
		startDate && (this.start = startDate);
		packageType && (this.pakage = packageType);
	}

	@prop({ required: true, enum: Object.values(SubscriptionPackage) })
	public pakage!: SubscriptionPackage;

	@prop({ required: true })
	public start!: Date;

	@prop({ required: true })
	public end!: Date;
}
