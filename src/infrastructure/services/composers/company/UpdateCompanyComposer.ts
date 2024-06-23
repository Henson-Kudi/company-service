import IMessagingProvider from '../../../../application/providers/messaging.provider';
import UpdateCompanyUseCase from '../../../../application/use-cases/implementations/UpdateCompany';
import UpdateCompanyController from '../../../../presentation/http/controllers/CompanyController/UpdateCompany.controller';
import IContoller from '../../../../presentation/http/controllers/IController';
import CompaniesRepositoryMongo from '../../../repositories/Companies';

export default function updateCompanyComposer(
	messagingProvider?: IMessagingProvider
): IContoller {
	const companyRepo = new CompaniesRepositoryMongo();

	const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepo, {
		messagingProvider
	});

	const controller = new UpdateCompanyController(updateCompanyUseCase);

	return controller;
}
