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

import ICreateCompanyDTO from '../../domain/dtos/CreateUser';
import CompanySchema from '../../domain/entities/Company';

export default interface ICompanyRepository {
	create(company: ICreateCompanyDTO): Promise<CompanySchema>;

	updateMany(
		filter: FilterQuery<CompanySchema>,
		update: UpdateQuery<CompanySchema>,
		options?: mongo.UpdateOptions
	): Promise<CompanySchema[]>;

	findByIdAndUpdate(
		id: Types.ObjectId,
		update: UpdateQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<CompanySchema | null>;

	updateOne(
		filter: FilterQuery<CompanySchema>,
		update: UpdateQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<CompanySchema | null>;

	findMany(
		filter: FilterQuery<CompanySchema>,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<CompanySchema[]>;

	findOne(
		filter: FilterQuery<CompanySchema>,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<CompanySchema | null>;

	findById(
		id: Types.ObjectId,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<CompanySchema | null>;

	deleteMany(
		filter: FilterQuery<CompanySchema>,
		options?: mongo.DeleteOptions
	): Promise<mongo.DeleteResult>;

	deleteOne(
		filter: FilterQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<CompanySchema | null>;

	findByIdAndDelete(
		id: Types.ObjectId,
		options?: QueryOptions<CompanySchema>
	): Promise<CompanySchema | null>;

	aggregate(
		pipeline: PipelineStage[],
		options?: AggregateOptions
	): Promise<unknown[]>;

	bulkWrite(
		operation: AnyBulkWriteOperation<CompanySchema>[],
		options?: MongooseBulkWriteOptions
	): Promise<mongo.BulkWriteResult>;
}
