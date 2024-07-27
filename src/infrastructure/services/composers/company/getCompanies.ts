import GetCompaniesUseCase from '../../../../application/use-cases/implementations/GetCompanies';
import GetCompaniesController from '../../../../presentation/http/controllers/CompanyController/GetCompanies.controller';
import IContoller from '../../../../presentation/http/controllers/IController';
import CompaniesRepositoryMongo from '../../../repositories/Companies';

export default function getCompaniesComposer(): IContoller {
    const companyRepo = new CompaniesRepositoryMongo();

    const getCompaniesUseCase = new GetCompaniesUseCase(companyRepo);

    const controller = new GetCompaniesController(getCompaniesUseCase);

    return controller;
}
