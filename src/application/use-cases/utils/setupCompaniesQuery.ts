import mongoose, { FilterQuery, isValidObjectId, ProjectionType, QueryOptions } from "mongoose";
import { ICompaniesQuery } from "../../../domain/dtos/FindCompanies";
import { DocumentType } from "@typegoose/typegoose";
import Company from "../../../domain/entities/Company";
import moment from "moment";
import { PaginationLimit } from "../../../infrastructure/utils/constants";

export default function setupCompaniesQuery(params: ICompaniesQuery): {
    filter: FilterQuery<DocumentType<Company>>,
    projection?: ProjectionType<DocumentType<Company>>,
    options: QueryOptions<DocumentType<Company>> & { limit: number, skip: number },
    pagination: { limit: number, page: number }
} {
    // SETUP FILTER QUERY
    const filters = params?.filter

    const filterQuery: FilterQuery<DocumentType<Company>> = {}

    if (filters?.createdBy) {
        const createdBy = (Array.isArray(filters.createdBy) ? filters.createdBy : [filters.createdBy])?.filter(item => isValidObjectId(item))?.map(item => mongoose.Types.ObjectId.createFromHexString(item.toString()))

        filterQuery.createdBy = {
            $in: createdBy
        }
    }

    if (filters?.isActive === 'true' || filters?.isActive === 'false') {
        filterQuery.isActive = filters.isActive === 'true'
    } else {
        filterQuery.isActive = true
    }

    if (filters?.isDeleted === 'true' || filters?.isDeleted === 'false') {
        filterQuery.isDeleted = filters.isDeleted === 'true'
    } else {
        filterQuery.isDeleted = false
    }

    if (filters?.name) {

        filterQuery.name = {
            $regex: filters.name,
            $options: 'i'
        }
    }

    if (filters?.representative) {
        const rep = (Array.isArray(filters.representative) ? filters.representative : [filters.representative])?.filter(item => isValidObjectId(item))?.map(item => mongoose.Types.ObjectId.createFromHexString(item.toString()))

        filterQuery.representative = {
            $in: rep
        }
    }

    // For now we can only search companies by name. This might need to be changed if the concept of company serial numbers (unique ids) is implemented
    if (filters?.search && !filters.name) {
        filterQuery.name = {
            name: {
                $regex: filters.search,
                $options: 'i'
            }
        }
    }

    if (filters?.subscriptionEnd || filters?.subscriptionStart) {
        const validEnd = filters?.subscriptionEnd && moment.isDate(new Date(filters.subscriptionEnd))
        const validStart = filters?.subscriptionStart && moment.isDate(new Date(filters.subscriptionStart))

        const dateFilters = []

        if (validEnd) {
            const endDate = moment(filters.subscriptionEnd).toDate()

            const [year, month, date] = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()]

            dateFilters.push(...[{ $eq: [{ $year: "$subscription.end" }, year] },
            { $eq: [{ $month: "$subscription.end" }, month] },
            { $eq: [{ $dayOfMonth: "$subscription.end" }, date] }])
        }

        if (validStart) {
            const startDate = moment(filters.subscriptionStart).toDate()

            const [year, month, date] = [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()]

            dateFilters.push(...[{ $eq: [{ $year: "$subscription.start" }, year] },
            { $eq: [{ $month: "$subscription.start" }, month] },
            { $eq: [{ $dayOfMonth: "$subscription.start" }, date] }])
        }

        dateFilters.length && (filterQuery['$expr'] = {
            $and: dateFilters
        })

    }

    // SETUP PROJECTION
    const projection: Record<string, 1> = {}

    if (params.options?.projectFields) {
        params.options.projectFields.map((field: string) => {
            projection[field] = 1
        })
    }

    // SETUP OPTIONS
    const limit = params?.options?.limit && !isNaN(Number(params.options.limit)) && Number(params.options.limit) > 0 ? Number(params.options.limit) : PaginationLimit

    const page = params?.options?.page && !isNaN(Number(params.options.page)) && Number(params.options.page) > 0 ? Number(params.options.page) : 1

    const skip = (page - 1) * limit

    const options: QueryOptions<DocumentType<Company>> & { limit: number, skip: number } = {
        limit: limit,
        skip: skip
    }

    if (params.options?.sort) {
        const sort: Record<string, 1 | -1> = {}

        Object.entries(params.options.sort).filter(([, value]) => value
            === 1 || value
            === -1).map(([key, value]) => {
                sort[key] = value
            })

        options.sort = sort
    }





    return {
        filter: filterQuery,
        options: options,
        projection: Object.keys(projection).length ? projection : undefined,
        pagination: { limit, page }
    }

}