import { Types, UpdateQuery } from "mongoose";
import UpdateCompanyDTO from "../../../domain/dtos/UpdateCompanyDTO";
import { DocumentType } from "@typegoose/typegoose";
import Company from "../../../domain/entities/Company";

export default interface IUpdateCompany {
    execute(companyId: Types.ObjectId, update: UpdateQuery<UpdateCompanyDTO>): Promise<DocumentType<Company>>
}