import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import UpdateCompanyDTO from '../../../domain/dtos/UpdateCompanyDTO';
import Company from '../../../domain/entities/Company';
import IUpdateCompany from '../interfaces/IUpdateCompany';
import { UpdateCompanySchema } from '../../../domain/schemas/Company.schema';
import IMessagingProvider from '../../providers/messaging.provider';
import ICompanyRepository from '../../repositories/Companies';
import CustomError from '../../../domain/errors/CustomError';
import ResponseCodes from '../../../domain/enums/ResponseCodes';
import DataUpdatedDTO from '../../../domain/dtos/DataUpdatedDTO';
import rabbitMqQueues from '../../../domain/valueObjects/rabbitMqQueues';
import logger from '../../../infrastructure/utils/logging/winstonLogger';
import validateJoiSchemaAsync from '../../../infrastructure/utils/validateJoiSchema';
import slugifyString from '../../../infrastructure/utils/slugifyString';

export default class UpdateCompanyUseCase
implements IUpdateCompany<UpdateCompanyDTO>
{
	constructor(
		private companiesRepository: ICompanyRepository,
		private providers: { messagingProvider?: IMessagingProvider }
		// Add more repositories and services needed by this use case
	) {}

	async execute(
		companyId: Types.ObjectId,
		update: UpdateCompanyDTO
	): Promise<DocumentType<Company> | null> {
		const { messagingProvider } = this.providers;
		// If update data is empty object, we want to throw error
		if (!Object.keys(update).length) {
			throw new CustomError(
				'Invalid Data. Atleast one property required for update',
				ResponseCodes.BadRequest
			);
		}
		// Ensure update data is  correct
		await validateJoiSchemaAsync(UpdateCompanySchema, update);

		const foundCompany = await this.companiesRepository.findById(companyId);

		if (!foundCompany) {
			return null;
		}

		// If we need to update the name, we want to ensure that this user had not already use the updated name to create a new company
		if (update.name) {
			const foundWithName = await this.companiesRepository.findOne({
				createdBy: foundCompany.createdBy,
				nameSlug: slugifyString(update?.name)
			});

			if (foundWithName) {
				throw new CustomError(
					'There is already a company with given name',
					ResponseCodes.BadRequest
				);
			}

			foundCompany.name = update.name;
			foundCompany.nameSlug = slugifyString(update.name);
		}

		// Update the fields that need to be updated
		update.representative &&
			(foundCompany.representative = {
				...foundCompany.representative,
				...update.representative
			});

		const savedCompany = await foundCompany.save();

		// Post  a message to rabbit mq indicating an update on company
		const dataToPost = new DataUpdatedDTO<UpdateCompanyDTO>(companyId, update);

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
