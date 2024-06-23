import Joi from '@hapi/joi';
import SubscriptionPackage from '../enums/SubscriptionPackage';

const CreateCompanySchema = Joi.object({
	name: Joi.string().required().min(3).max(52),
	createdBy: Joi.string()
		.required()
		.regex(/^[0-9a-fA-F]{24}$/)
		.message('Invalid owner id. Please pass valid id.'),
	representative: Joi.object({
		name: Joi.string().required(),
		email: Joi.string().required(),
		phone: Joi.string().required(),
		address: Joi.string().optional(),
		position: Joi.string().required()
		// add other fields
	})
		.pattern(Joi.string().required(), Joi.string().required())
		.optional()
		.allow('')
		.allow(null),
	subScription: Joi.object({
		package: Joi.number()
			.required()
			.valid(...Object.values(SubscriptionPackage).filter((item): item is number => typeof item === 'number')),
		start: Joi.date().required(),
		end: Joi.date().when('type', {
			is: 0,
			then: Joi.date().optional(),
			otherwise: Joi.date().required()
		})
	}).required()
});

export const UpdateCompanySchema = Joi.object({
	name: Joi.string().optional(),
	representative: Joi.object({
		name: Joi.string().optional(),
		email: Joi.string().optional(),
		phone: Joi.string().optional(),
		address: Joi.string().optional(),
		position: Joi.string().optional()
	})
		.pattern(Joi.string().required(), Joi.string().required())
		.optional()
});

export const UpdateCompanySubscriptionSchema = Joi.object({
	subScription: Joi.object({
		package: Joi.string()
			.optional()
			.valid(...Object.values(SubscriptionPackage).filter((item): item is number => typeof item === 'number')),
		start: Joi.date().optional(),
		end: Joi.date().optional()
	}).required()
});

// No one should be able to update owner, isActive or isDeleted when trying to update company details. Instead they should make a request to a special route

export default CreateCompanySchema;
