import type vi from "@/locales/vi/common.json";

// Type helper to generate dot-notation keys from JSON structure

type Primitive = string | number | boolean | null;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (
  T extends Primitive
    ? ""
    : {
        [K in Extract<keyof T, string>]: T[K] extends Primitive
          ? K
          : `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
      }[Extract<keyof T, string>]
) extends infer D
  ? Extract<D, string>
  : never;

export type I18nKey = DotNestedKeys<typeof vi>;
