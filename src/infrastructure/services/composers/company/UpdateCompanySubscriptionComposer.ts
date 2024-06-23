import IMessagingProvider from '../../../../application/providers/messaging.provider';
import UpdateCompanySubscriptionUseCase from '../../../../application/use-cases/implementations/UpdateSubscription';
import UpdateCompanySubscriptionController from '../../../../presentation/http/controllers/CompanyController/UpdateCompanySub.controller';
import IContoller from '../../../../presentation/http/controllers/IController';
import CompaniesRepositoryMongo from '../../../repositories/Companies';

export default function updateCompanySubscriptionComposer(
	messagingProvider?: IMessagingProvider
): IContoller {
	const companyRepo = new CompaniesRepositoryMongo();

	const updateCompanySubscriptionUseCase = new UpdateCompanySubscriptionUseCase(
		companyRepo,
		{
			messagingProvider
		}
	);

	const controller = new UpdateCompanySubscriptionController(
		updateCompanySubscriptionUseCase
	);

	return controller;
}
