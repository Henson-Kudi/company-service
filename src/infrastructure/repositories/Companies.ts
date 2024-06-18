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
import ICreateCompanyDTO from '../../domain/dtos/CreateUser';
import CompanySchema from '../../domain/entities/Company';
import CompanyModel from '../databases/mongodb/models/CompanyModel';

export default class CompaniesRepositoryMongo implements CompaniesRepository {
    async create(company: ICreateCompanyDTO): Promise<CompanySchema> {
        const newCompany = new CompanySchema(company);

        const created = await CompanyModel.create(newCompany);

        return created.toJSON();
    }

    async updateMany(
        filter: FilterQuery<CompanySchema>,
        update: UpdateQuery<CompanySchema>,
        options?: mongo.UpdateOptions
    ): Promise<CompanySchema[]> {
        await CompanyModel.updateMany(filter, update, options);

        const updatedData = await CompanyModel.find(filter);

        return updatedData?.map((item) => item?.toJSON());
    }

    findByIdAndUpdate(
        id: Types.ObjectId,
        update: UpdateQuery<CompanySchema>,
        options?: QueryOptions<CompanySchema>
    ): Promise<CompanySchema | null> {
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
    ): Promise<CompanySchema | null> {
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
    ): Promise<CompanySchema[]> {
        const found = await CompanyModel.find(filter, projection, options);

        return found.map((item) => item.toJSON());
    }

    async findOne(
        filter: FilterQuery<CompanySchema>,
        projection?: ProjectionType<CompanySchema>,
        options?: QueryOptions<CompanySchema>
    ): Promise<CompanySchema | null> {
        const found = await CompanyModel.findOne(filter, projection, options);

        return found ? found?.toJSON() : null;
    }

    async findById(
        id: Types.ObjectId,
        projection?: ProjectionType<CompanySchema>,
        options?: QueryOptions<CompanySchema>
    ): Promise<CompanySchema | null> {
        const found = await CompanyModel.findById(id, projection, options);

        return found ? found.toJSON() : null;
    }

    async deleteMany(
        filter: FilterQuery<CompanySchema>,
        options?: mongo.DeleteOptions
    ): Promise<mongo.DeleteResult> {
        const deleted = await CompanyModel.deleteMany(filter, options);

        return deleted;
    }

    async deleteOne(
        filter: FilterQuery<CompanySchema>,
        options?: QueryOptions<CompanySchema>
    ): Promise<CompanySchema | null> {
        const deleted = await CompanyModel.findOneAndDelete(filter, options);

        return deleted ? deleted.toJSON() : null;
    }

    async findByIdAndDelete(
        id: Types.ObjectId,
        options?: QueryOptions<CompanySchema>
    ): Promise<CompanySchema | null> {
        const deleted = await CompanyModel.findByIdAndDelete(id, options);

        return deleted ? deleted.toJSON() : null;
    }

    aggregate(
        pipeline: PipelineStage[],
        options?: AggregateOptions
    ): Promise<unknown[]> {
        return CompanyModel.aggregate(pipeline, options);
    }

    bulkWrite(
        operation: AnyBulkWriteOperation<CompanySchema>[],
        options?: MongooseBulkWriteOptions
    ): Promise<BulkWriteResult> {
        return CompanyModel.bulkWrite(operation, options);
    }
}
