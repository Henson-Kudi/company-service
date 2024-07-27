import GetCompanyUseCase from '../../../../application/use-cases/implementations/GetCompany';
import GetCompanyController from '../../../../presentation/http/controllers/CompanyController/GetCompany.controller';
import IContoller from '../../../../presentation/http/controllers/IController';
import CompaniesRepositoryMongo from '../../../repositories/Companies';

export default function getCompanyComposer(): IContoller {
    const companyRepo = new CompaniesRepositoryMongo();

    const getCompanyUseCase = new GetCompanyUseCase(companyRepo);

    const controller = new GetCompanyController(getCompanyUseCase);

    return controller;
}
