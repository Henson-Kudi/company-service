import Joi from '@hapi/joi';

export default async function validateJoiSchemaAsync<T>(
	schema: Joi.Schema,
	data: T,
	options: Joi.AsyncValidationOptions = { abortEarly: false }
): Promise<unknown> {
	return (await schema.validateAsync(data, options)) as unknown;
}

export function validateJoiSchema<T>(
	schema: Joi.Schema,
	data: T,
	options: Joi.ValidationOptions = { abortEarly: false }
) {
	return schema.validate(data, options);
}
