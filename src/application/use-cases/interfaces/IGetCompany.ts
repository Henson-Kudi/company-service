import { FlattenMaps, Types } from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import Company from '../../../domain/entities/Company';

export default interface IGetCompany {
    execute(
        companyId: Types.ObjectId
    ): Promise<FlattenMaps<DocumentType<Company>> | null>;
}
