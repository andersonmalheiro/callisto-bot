export function assertValueIsString(value: unknown): asserts value is string {
	if (!value || typeof value !== 'string') {
		throw Error('The provided value is not a valid string');
	}
}
