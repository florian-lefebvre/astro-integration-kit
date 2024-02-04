export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never;

// Converts union to overloaded function
type UnionToOvlds<U> = UnionToIntersection<
	U extends any ? (f: U) => void : never
>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// Finally me)
export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
	? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
	: [T, ...A];