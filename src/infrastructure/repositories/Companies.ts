import { BulkWriteResult } from 'mongodb';
import {
	FilterQuery,
	UpdateQuery,
	QueryOptions,
	Types,
	PipelineStage,
	AggregateOptions,
	AnyBulkWriteOperation,
	MongooseBulkWriteOptions,
	mongo,
	ProjectionType
} from 'mongoose';
import CompaniesRepository from '../../application/repositories/Companies';
import ICreateCompanyDTO from '../../domain/dtos/CreateCompanyDTO';
import CompanySchema from '../../domain/entities/Company';
import CompanyModel from '../databases/mongodb/models/CompanyModel';
import { DocumentType } from '@typegoose/typegoose/lib/types';

export default class CompaniesRepositoryMongo implements CompaniesRepository {
	countDocuments(filter?: FilterQuery<DocumentType<CompanySchema>>): Promise<number> {
		return CompanyModel.countDocuments(filter);
	}
	async create(
		company: ICreateCompanyDTO
	): Promise<DocumentType<CompanySchema>> {
		const newCompany = new CompanySchema(company);

		const created = await CompanyModel.create(newCompany);

		return created;
	}

	async updateMany(
		filter: FilterQuery<CompanySchema>,
		update: UpdateQuery<CompanySchema>,
		options?: mongo.UpdateOptions
	): Promise<DocumentType<CompanySchema>[]> {
		await CompanyModel.updateMany(filter, update, options);

		const updatedData = await CompanyModel.find(filter);

		return updatedData;
	}

	findByIdAndUpdate(
		id: Types.ObjectId,
		update: UpdateQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null> {
		const updated = CompanyModel.findByIdAndUpdate(id, update, {
			...options,
			new: options?.new ?? true
		});

		return updated;
	}

	updateOne(
		filter: FilterQuery<CompanySchema>,
		update: UpdateQuery<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null> {
		const updated = CompanyModel.findOneAndUpdate(filter, update, {
			...options,
			new: options?.new ?? true
		});

		return updated;
	}

	async findMany(
		filter: FilterQuery<CompanySchema>,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema>[]> {
		const found = await CompanyModel.find(filter, projection, options);

		return found;
	}

	async findOne(
		filter: FilterQuery<CompanySchema>,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null> {
		const found = await CompanyModel.findOne(filter, projection, options);

		return found;
	}

	async findById(
		id: Types.ObjectId,
		projection?: ProjectionType<CompanySchema>,
		options?: QueryOptions<CompanySchema>
	): Promise<DocumentType<CompanySchema> | null> {
		const found = await CompanyModel.findById(id, projection, options);

		return found;
	}

	async deleteMany(filter: FilterQuery<CompanySchema>): Promise<boolean> {
		const deleted = await CompanyModel.updateMany(filter, {
			isActive: false,
			isDeleted: true
		});

		return deleted?.modifiedCount ? true : false;
	}

	async deleteOne(filter: FilterQuery<CompanySchema>): Promise<boolean> {
		const found = await CompanyModel.findOne(filter);

		if (found) {
			found.isDeleted = true;
			found.isActive = false;

			await found.save();
		}

		return found ? true : false;
	}

	async findByIdAndDelete(id: Types.ObjectId): Promise<boolean> {
		const found = await CompanyModel.findById(id);

		if (found) {
			found.isDeleted = true;
			found.isActive = false;

			await found.save();
		}

		return found ? true : false;
	}

	async aggregate<T>(
		pipeline: PipelineStage[],
		options?: AggregateOptions
	): Promise<T[]> {
		//Define the structure of what you expect and the aggregation pipeline will return an array of ur expectation
		return await CompanyModel.aggregate<T>(pipeline, options);
	}

	bulkWrite(
		operation: AnyBulkWriteOperation<CompanySchema>[],
		options?: MongooseBulkWriteOptions
	): Promise<BulkWriteResult> {
		return CompanyModel.bulkWrite(operation, options);
	}
}
