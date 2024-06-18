import { Types } from 'mongoose';
import CompanyRep from '../valueObjects/CompanyRep';
import Subscription from '../valueObjects/Subscription';

export default interface ICreateCompanyDTO {
	name: string;
	createdBy: Types.ObjectId;
	representative: CompanyRep;
	subScription: Subscription;
	createdAt?: Date;
}
