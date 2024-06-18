import IRabbitMQProvider from '../../../../application/providers/RabbitMq.provider';
import CreateCompanyUseCase from '../../../../application/use-cases/implementations/CreateCompany';
import CreateCompanyController from '../../../../presentation/http/controllers/CompanyController/CreateCompany.controller';
import IContoller from '../../../../presentation/http/controllers/IController';
import CompaniesRepositoryMongo from '../../../repositories/Companies';

export default function createCompanyComposer(
	rabbitMQProvider?: IRabbitMQProvider
): IContoller {
	const companyRepo = new CompaniesRepositoryMongo();

	const createCompanyUseCase = new CreateCompanyUseCase(companyRepo, {
		rabbitMQProvider
	});

	const controller = new CreateCompanyController(createCompanyUseCase);

	return controller;
}
