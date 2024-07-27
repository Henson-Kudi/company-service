import { ICompaniesQuery } from "../../../domain/dtos/FindCompanies";
import ICompanyRepository from "../../repositories/Companies";
import IGetCompanies from "../interfaces/IGetCompanies";
import { FlattenMaps } from "mongoose";
import Company from "../../../domain/entities/Company";
import setupCompaniesQuery from "../utils/setupCompaniesQuery";

export default class GetCompaniesUseCase implements IGetCompanies {
    constructor(
        private companyRepo: ICompanyRepository
    ) { }
    async execute(params: ICompaniesQuery): Promise<{
        page: number,
        total: number,
        data: FlattenMaps<Company>[],
        limit: number
    }> {
        // Setup query
        const queryData = setupCompaniesQuery(params)

        const count = await this.companyRepo.countDocuments(queryData?.filter ?? {});

        const companies = (await this.companyRepo.findMany(queryData?.filter ?? {}, queryData?.projection, queryData.options))?.map(item => item?.toJSON());

        return {
            data: companies ?? [],
            total: count,
            page: queryData.pagination.page,
            limit: queryData.pagination.limit,
        };
    }
}