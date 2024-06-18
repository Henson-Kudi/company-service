import ICreateCompanyDTO from '../../../domain/dtos/CreateUser';
import CompanySchema from '../../../domain/entities/Company';

export default interface ICreateCompanyUseCase {
	execute(data: ICreateCompanyDTO): Promise<CompanySchema>;
}
