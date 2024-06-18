import { getModelForClass } from '@typegoose/typegoose';
import Company from '../../../../domain/entities/Company';

const CompanyModel = getModelForClass(Company);

export default CompanyModel;
