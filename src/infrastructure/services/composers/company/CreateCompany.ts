import IMessagingProvider from '../../../../application/providers/messaging.provider';
import CreateCompanyUseCase from '../../../../application/use-cases/implementations/CreateCompany';
import CreateCompanyController from '../../../../presentation/http/controllers/CompanyController/CreateCompany.controller';
import IContoller from '../../../../presentation/http/controllers/IController';
import CompaniesRepositoryMongo from '../../../repositories/Companies';

export default function createCompanyComposer(
	messagingProvider?: IMessagingProvider
): IContoller {
	const companyRepo = new CompaniesRepositoryMongo();

	const createCompanyUseCase = new CreateCompanyUseCase(companyRepo, {
		messagingProvider
	});

	const controller = new CreateCompanyController(createCompanyUseCase);

	return controller;
}
