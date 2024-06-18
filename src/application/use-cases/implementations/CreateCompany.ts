import ICreateCompanyDTO from '../../../domain/dtos/CreateUser';
import CompanySchema from '../../../domain/entities/Company';
import ResponseCodes from '../../../domain/enums/ResponseCodes';
import CustomError from '../../../domain/errors/CustomError';
import rabbitMqQueues from '../../../domain/valueObjects/rabbitMqQueues';
import slugifyString from '../../../infrastructure/utils/slugifyString';
import IRabbitMQProvider from '../../providers/RabbitMq.provider';
import ICompanyRepository from '../../repositories/Companies';
import ICreateCompany from '../interfaces/ICreateCommpany';

export default class CreateCompanyUseCase implements ICreateCompany {
	constructor(
		private companiesRepository: ICompanyRepository,
		private providers: { rabbitMQProvider?: IRabbitMQProvider }
		// Add more repositories and services needed by this use case
	) {}
	async execute(data: ICreateCompanyDTO): Promise<CompanySchema> {
		const { rabbitMQProvider } = this.providers;
		// We want to validate the data with JOi  schema first to ensure it is in format we want
		// await createCompanySchema.validateAsync(data, {abortEarly: false})

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

		rabbitMQProvider &&
			(await rabbitMQProvider.publishMessage({
				exchange: rabbitMqQueues.COMPANY_EXCHANGE.name,
				exchangeType: 'topic',
				routeKey: rabbitMqQueues.COMPANY_EXCHANGE.routeKeys.companyCreated,
				task: Buffer.from(JSON.stringify(company))
			}));

		// Add more business logic functionalities here. like publishing to rabbitMQ, sending a mail to the creator

		return company;
	}
}
