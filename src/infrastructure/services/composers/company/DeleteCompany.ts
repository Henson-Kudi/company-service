import IMessagingProvider from '../../../../application/providers/messaging.provider';
import DeleteCompanyUseCase from '../../../../application/use-cases/implementations/DeleteCompany';
import UpdateCompanyController from '../../../../presentation/http/controllers/CompanyController/UpdateCompany.controller';
import IContoller from '../../../../presentation/http/controllers/IController';
import CompaniesRepositoryMongo from '../../../repositories/Companies';

export default function deleteCompanyComposer(
    messagingProvider?: IMessagingProvider
): IContoller {
    const companyRepo = new CompaniesRepositoryMongo();

    const deleteCompanyUseCase = new DeleteCompanyUseCase(companyRepo, {
        messagingProvider
    });

    const controller = new UpdateCompanyController(deleteCompanyUseCase);

    return controller;
}
