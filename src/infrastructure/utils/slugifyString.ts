import slugify from 'slugify';

export default function slugifyString(
	string: string,
	options?:
		| {
		replacement?: string;
		remove?: RegExp;
		lower?: boolean;
		strict?: boolean;
		locale?: string;
		trim?: boolean;
		  }
		| string
): string {
	return slugify(
		string,
		options ?? {
			remove: /[^\w\s]/g, //this regex removes all special characters and whitespaces in strings
			replacement: '-',
			trim: true,
			lower: true
		}
	);
}
