import { index, prop, pre } from '@typegoose/typegoose';
import mongoose from 'mongoose';

import BaseDocument from '../valueObjects/baseDoc';
import CompanyRep from '../valueObjects/CompanyRep';
import Subscription from '../valueObjects/Subscription';
import ICreateCompanyDTO from '../dtos/CreateUser';
import slugifyString from '../../infrastructure/utils/slugifyString';

@index(
	{
		nameSlug: 1,
		createdBy: 1
	},
	{
		unique: true
	}
)
@pre<Company>('save', function () {
	this.nameSlug = slugifyString(this.name)
})
export default class Company extends BaseDocument {
	constructor(data: ICreateCompanyDTO) {
		super();

		Object.assign(this, data);

		this.nameSlug = slugifyString(data.name)

		data.createdAt && (this.createdAt = data?.createdAt);
	}

	@prop({
		required: true,
		trim: true,
		index: true,
		maxlength: 52,
		minlength: 3
	})
	public name!: string;

	@prop({
		required: true,
		trim: true,
		index: true,
		maxlength: 52,
		minlength: 3,
		lowercase: true
	})
	public nameSlug!: string;

	@prop({ required: true })
	public createdBy!: mongoose.Types.ObjectId;

	@prop({})
	public representative?: CompanyRep;

	@prop({ required: true })
	public subScription!: Subscription;

	@prop({ required: false, default: true })
	public isActive?: boolean;

	@prop({ required: false, default: false })
	public isDeleted?: boolean;
}
