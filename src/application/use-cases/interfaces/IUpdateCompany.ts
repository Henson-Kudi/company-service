import { Types, UpdateQuery } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import Company from '../../../domain/entities/Company';

export default interface IUpdateCompany<T> {
	execute(
		companyId: Types.ObjectId,
		update: UpdateQuery<T>
	): Promise<DocumentType<Company> | null>;
}
