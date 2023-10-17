import { assertValueIsString } from '../assertions/isString';

export function getEnv(variableName: string) {
	const value = process.env[variableName];
	assertValueIsString(value);
	return value;
}
