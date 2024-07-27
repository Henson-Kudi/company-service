import { ProjectionType, QueryOptions, Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import Company from '../../../domain/entities/Company';

export default interface IDeleteCompany {
    execute(
        companyId: Types.ObjectId,
        projection?:ProjectionType<DocumentType<Company>>,
        options?:QueryOptions<DocumentType<Company>>,
    ): Promise<DocumentType<Company> | null>;
}
