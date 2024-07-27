import { FlattenMaps } from 'mongoose';
import Company from '../../../domain/entities/Company';
import { ICompaniesQuery } from '../../../domain/dtos/FindCompanies';

export default interface IGetCompanies {
    execute(
        params: ICompaniesQuery,
    ): Promise<{
        page: number,
        total: number,
        data: FlattenMaps<Company>[],
        limit: number
    }>;
}
