import CompanyRep from '../valueObjects/CompanyRep';

export default interface UpdateCompanyDTO {
	name?: string;
	representative?: CompanyRep;

	// We do not want to update fields like subscription, createdBy(company owner or Root User) from here since these are crucal and need special handling. We should have special methods and api endpoints for handling these. Field like updatedAt would be updated automatically
}
