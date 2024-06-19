import { DocumentType } from '@typegoose/typegoose';
import ICreateCompanyDTO from '../../../domain/dtos/CreateCompanyDTO';
import CompanySchema from '../../../domain/entities/Company';

export default interface ICreateCompanyUseCase {
	execute(data: ICreateCompanyDTO): Promise<DocumentType<CompanySchema>>;
}
