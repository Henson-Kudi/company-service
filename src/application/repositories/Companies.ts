import {
	AggregateOptions,
	AnyBulkWriteOperation,
	FilterQuery,
	MongooseBulkWriteOptions,
	PipelineStage,
	ProjectionType,
	QueryOptions,
	Types,
	UpdateQuery,
	mongo
} from 'mongoose';

import ICreateCompanyDTO from '../../domain/dtos/CreateCompanyDTO';
import CompanySchema from '../../domain/entities/Company';
import { DocumentType } from '@typegoose/typegoose';

export default interface ICompanyRepository {
	create(company: ICreateCompanyDTO): Promise<DocumentType<CompanySchema>>;

	updateMany(
		filter: FilterQuery<CompanySchema>,
		update: UpdateQuery<CompanySchema>,
		options?: mongo.UpdateOptions
	): Promise<DocumentType<CompanySchema>[]>;

	findByIdAndUpdate(
		id: Types.ObjectId,
		update: UpdateQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null>;

	countDocuments(
		filter?:FilterQuery<DocumentType<CompanySchema>>
	): Promise<number>;

	updateOne(
		filter: FilterQuery<CompanySchema>,
		update: UpdateQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null>;

	findMany(
		filter: FilterQuery<CompanySchema>,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema>[]>;

	findOne(
		filter: FilterQuery<CompanySchema>,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null>;

	findById(
		id: Types.ObjectId,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null>;

	deleteMany(filter: FilterQuery<CompanySchema>): Promise<boolean>;

	deleteOne(
		filter: FilterQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<boolean>;

	findByIdAndDelete(
		id: Types.ObjectId,
		options?: QueryOptions<CompanySchema>
	): Promise<boolean>;

	aggregate<T>(
		pipeline: PipelineStage[],
		options?: AggregateOptions
	): Promise<T[]>; //When doing an aggregatation, you can define the return type you expect

	bulkWrite(
		operation: AnyBulkWriteOperation<CompanySchema>[],
		options?: MongooseBulkWriteOptions
	): Promise<mongo.BulkWriteResult>;
}
