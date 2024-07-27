import { DocumentType } from "@typegoose/typegoose";
import { FlattenMaps, ProjectionType, QueryOptions, Types } from "mongoose";
import Company from "../../../domain/entities/Company";
import ICompanyRepository from "../../repositories/Companies";
import IGetCompany from "../interfaces/IGetCompany";

export default class GetCompanyUseCase implements IGetCompany {
    constructor(private companyRepo: ICompanyRepository) { }

    async execute(companyId: Types.ObjectId, projections?: ProjectionType<DocumentType<Company>>, options?: QueryOptions<DocumentType<Company>>): Promise<FlattenMaps<DocumentType<Company>> | null> {
        const foundCompany = await this.companyRepo.findById(companyId, projections, options)

        if (!foundCompany) {
            return null
        }

        return foundCompany?.toJSON()
    }
}