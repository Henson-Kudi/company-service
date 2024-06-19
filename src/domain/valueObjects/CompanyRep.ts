import { prop } from '@typegoose/typegoose';

interface ICompanyRep {
	address?: string;
	email: string;
	phone: string;
	position: string;
	name: string;
}

export default class CompanyRep implements ICompanyRep {
	constructor({
		email,
		phone,
		address,
		name,
		position
	}: {
		email: string;
		phone: string;
		address?: string;
		position: string;
		name: string;
	}) {
		email && (this.email = email);
		phone && (this.phone = phone);
		address && (this.address = address);
		name && (this.name = name);
		position && (this.position = position);
	}
	@prop()
	public address?: string;

	@prop({ required: true })
	public email!: string;

	@prop({ required: true })
	public phone!: string;

	@prop({ required: true })
	public position!: string;

	@prop({ required: true })
	public name!: string;
}
