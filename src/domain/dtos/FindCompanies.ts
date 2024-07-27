import { ObjectId } from "mongoose"
import Company from "../entities/Company"

export type ICompaniesFilterOptions = {
    sort?: Partial<Record<keyof Omit<Company, 'representative' | 'subscription' | 'nameSlug'>, 1 | -1>> & { 'subscription.start'?: 1 | -1, 'subscription.end'?: 1 | -1, 'representative.name'?: 1 | -1 },
    limit?: number,
    projectFields?: (keyof Company)[],
    page?: number
}

export type ICompaniesFilter = {
    name?: string,
    representative?: string | ObjectId | (string | ObjectId)[],
    subscriptionStart?: string | Date | number,
    subscriptionEnd?: string | Date | number,
    createdBy?: string | ObjectId | (string | ObjectId)[]
    isActive?: 'true' | 'false'
    isDeleted?: 'true' | 'false'
    search?: string
}

export type ICompaniesQuery = {
    filter?: ICompaniesFilter,
    options?: ICompaniesFilterOptions
}