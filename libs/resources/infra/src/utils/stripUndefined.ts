/**
 * Removes keys whose value is `undefined` from an object.-
 */
export function stripUndefined<T extends object>(obj?: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj ?? {}).filter(([, value]) => value !== undefined),
	) as Partial<T>;
}
