import { prop } from '@typegoose/typegoose';
import SubscriptionPackage from '../enums/SubscriptionPackage';

interface ISubscription {
	package: SubscriptionPackage;
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
		packageType && (this.package = packageType);
	}

	@prop({
		required: true,
		enum: Object.values(SubscriptionPackage).filter(
			(item): item is number => typeof item === 'number'
		),
		type: () => Number
	})
	public package!: SubscriptionPackage;

	@prop({ required: true })
	public start!: Date;

	@prop({ required: true })
	public end!: Date;
}
