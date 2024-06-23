import { DocumentType } from '@typegoose/typegoose';
import ICreateCompanyDTO from '../../../domain/dtos/CreateCompanyDTO';
import CompanySchema from '../../../domain/entities/Company';
import ResponseCodes from '../../../domain/enums/ResponseCodes';
import CustomError from '../../../domain/errors/CustomError';
import rabbitMqQueues from '../../../domain/valueObjects/rabbitMqQueues';
import slugifyString from '../../../infrastructure/utils/slugifyString';
import IMessagingProvider from '../../providers/messaging.provider';
import ICompanyRepository from '../../repositories/Companies';
import ICreateCompany from '../interfaces/ICreateCommpany';
import CreateCompanySchema from '../../../domain/schemas/Company.schema';
import logger from '../../../infrastructure/utils/logging/winstonLogger';
import validateJoiSchemaAsync from '../../../infrastructure/utils/validateJoiSchema';

export default class CreateCompanyUseCase implements ICreateCompany {
	constructor(
		private companiesRepository: ICompanyRepository,
		private providers: { messagingProvider?: IMessagingProvider }
		// Add more repositories and services needed by this use case
	) {}
	async execute(data: ICreateCompanyDTO): Promise<DocumentType<CompanySchema>> {
		const { messagingProvider } = this.providers;
		// We want to validate the data with JOi  schema first to ensure it is in format we want
		await validateJoiSchemaAsync<ICreateCompanyDTO>(CreateCompanySchema, data);

		// We also want to make sure this company name is not already used by same user
		const alreadyExist = await this.companiesRepository.findOne({
			nameSlug: slugifyString(data.name),
			createdBy: data.createdBy
		});

		// We want to throw an error of already exist if company already exists
		if (alreadyExist) {
			throw new CustomError(
				`Company (${alreadyExist.name}) already exists.`,
				ResponseCodes.BadRequest
			);
		}

		const company = await this.companiesRepository.create(data);

		//
		if (messagingProvider) {
			// We are handling this error at this stage because we don't want to throw an error if publishing message fails. Company was created successfully so the transaction was successfull
			try {
				await messagingProvider.publishMessage('exchange', {
					exchange: rabbitMqQueues.COMPANY_EXCHANGE.name,
					exchangeType: 'topic',
					routeKey: rabbitMqQueues.COMPANY_EXCHANGE.routeKeys.companyCreated,
					task: Buffer.from(JSON.stringify(company))
				});
			} catch (error) {
				logger.error(error);
			}
		}

		// Add more business logic functionalities here. like publishing to rabbitMQ, sending a mail to the creator

		return company;
	}
}
