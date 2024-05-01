import { RouteGenericInterface } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

type CapitalizeFirstLetter<S extends string> = S extends `${infer F}${infer R}` ? `${Uppercase<F>}${R}` : S;

type SchemaToRequestTypes<T extends Record<keyof T, JSONSchema>> = RouteGenericInterface & {
  [K in keyof T as CapitalizeFirstLetter<K & string>]: FromSchema<T[K]>;
};

export default SchemaToRequestTypes;
