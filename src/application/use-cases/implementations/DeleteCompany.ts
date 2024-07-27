import { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import Company from "../../../domain/entities/Company";
import IMessagingProvider from "../../providers/messaging.provider";
import ICompanyRepository from "../../repositories/Companies";
import IDeleteCompany from "../interfaces/IDeleteCompany";
import rabbitMqQueues from "../../../domain/valueObjects/rabbitMqQueues";

export default class DeleteCompanyUseCase implements IDeleteCompany {
    constructor(private companyRepo: ICompanyRepository, private providers: {
        messagingProvider?: IMessagingProvider
    }) { }

    async execute(companyId: Types.ObjectId): Promise<DocumentType<Company> | null> {
        const deletedCompany = await this.companyRepo.findByIdAndUpdate(companyId, {
            isActive: false,
            isDeleted: true
        })

        // Publish company deleted message
        if (deletedCompany && this.providers.messagingProvider) {
            await this.providers.messagingProvider.publishMessage('exchange', {
                exchange: rabbitMqQueues.COMPANY_EXCHANGE.name,
                exchangeType: 'topic',
                routeKey: rabbitMqQueues.COMPANY_EXCHANGE.routeKeys.companyDeleted,
                task: Buffer.from(JSON.stringify(deletedCompany)),
                options: {
                    assert: {
                        durable: true
                    },
                }
            })
        }

        return deletedCompany
    }
}