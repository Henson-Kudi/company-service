import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import Company from '../../../domain/entities/Company';
import IUpdateCompany from '../interfaces/IUpdateCompany';
import { UpdateCompanySubscriptionSchema } from '../../../domain/schemas/Company.schema';
import IMessagingProvider from '../../providers/messaging.provider';
import ICompanyRepository from '../../repositories/Companies';
import CustomError from '../../../domain/errors/CustomError';
import ResponseCodes from '../../../domain/enums/ResponseCodes';
import DataUpdatedDTO from '../../../domain/dtos/DataUpdatedDTO';
import rabbitMqQueues from '../../../domain/valueObjects/rabbitMqQueues';
import logger from '../../../infrastructure/utils/logging/winstonLogger';
import validateJoiSchemaAsync from '../../../infrastructure/utils/validateJoiSchema';
import UpdateCompanySubscriptionDTO from '../../../domain/dtos/UpdateCompanySubscriptionDTO';
import moment from 'moment';

export default class UpdateCompanySubscriptionUseCase
    implements IUpdateCompany<UpdateCompanySubscriptionDTO> {
    constructor(
        private companiesRepository: ICompanyRepository,
        private providers: { messagingProvider?: IMessagingProvider }
        // Add more repositories and services needed by this use case
    ) { }

    async execute(
        companyId: Types.ObjectId,
        update: UpdateCompanySubscriptionDTO
    ): Promise<DocumentType<Company> | null> {
        const { messagingProvider } = this.providers;
        // If update data is empty object, we want to throw error
        if (!Object.keys(update.subScription).length) {
            throw new CustomError(
                'Invalid Data. Atleast one property required for update',
                ResponseCodes.BadRequest
            );
        }
        // Ensure update data is  correct
        await validateJoiSchemaAsync(UpdateCompanySubscriptionSchema, update);

        const foundCompany = await this.companiesRepository.findById(companyId);

        if (!foundCompany) {
            return null;
        }

        // Ensure subscription end date is ahead of subscription start date and subscription end date is in the future
        const {
            subScription: { start, end }
        } = update;

        const startDate = moment(start ?? foundCompany?.subScription.start);
        const endDate = moment(end ?? foundCompany?.subScription?.end);
        const now = moment();

        if (endDate.isSameOrBefore(startDate) || endDate.isSameOrBefore(now)) {
            throw new CustomError(
                'End date must be in future of start date and now!',
                ResponseCodes.BadRequest
            );
        }

        // Update the fields that need to be updated
        foundCompany.subScription = {
            ...foundCompany.subScription,
            ...update.subScription
        };

        const savedCompany = await foundCompany.save();

        // Post  a message to rabbit mq indicating an update on company
        const dataToPost = new DataUpdatedDTO<UpdateCompanySubscriptionDTO>(
            companyId,
            update
        );

        if (messagingProvider) {
            // We want to catch any error thrown by rabbitMq if  it fails to post message to channel but still return the updated company because the main objective of update is achieved. if any error is thrown by rabbit mq, we should log this to logs and try to solve the problem manualy
            try {
                await this.providers.messagingProvider?.publishMessage('exchange', {
                    exchange: rabbitMqQueues.COMPANY_EXCHANGE.name,
                    exchangeType: 'topic',
                    routeKey: rabbitMqQueues.COMPANY_EXCHANGE.routeKeys.companyUpdated,
                    task: Buffer.from(JSON.stringify(dataToPost)),
                    options: {
                        assert: {}
                    }
                });
            } catch (error) {
                logger.error(error);
                // We might want to do more with this error. Maybe sending slack message, etc
            }
        }

        return savedCompany;
    }
}
