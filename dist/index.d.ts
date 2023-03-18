import * as solid_js from 'solid-js';
import { FlowComponent, Accessor, Setter } from 'solid-js';

/**
 * This creates a I18nContext. It's extracted into a function to be able to type the Context
 * before it's even initialized.
 *
 * @param [init={}] {Record<string, Record<string, any>>} - Initial dictionary of languages
 * @param [lang=navigator.language] {string} - The default language fallback to browser language if not set
 * @param [readFn=deepReadObject] {<T = any>(obj: Record<string, unknown>, path: string, defaultValue?: unknown) => T} - Read function used to read the dictionary
 */
declare const createI18nContext: (init?: Record<string, Record<string, any>>, lang?: string, readFn?: <T = any>(obj: Record<string, unknown>, path: string, defaultValue?: unknown) => T) => [template: (key: string, params?: Record<string, string>, defaultValue?: string) => any, actions: {
    add(lang: string, table: Record<string, any>): void;
    locale: (lang?: string) => string;
    dict: (lang: string) => Record<string, Record<string, any>>;
}];
type I18nContextInterface = ReturnType<typeof createI18nContext>;
declare const I18nContext: solid_js.Context<[template: (key: string, params?: Record<string, string>, defaultValue?: string) => any, actions: {
    add(lang: string, table: Record<string, any>): void;
    locale: (lang?: string) => string;
    dict: (lang: string) => Record<string, Record<string, any>>;
}]>;
declare const useI18n: () => [template: (key: string, params?: Record<string, string>, defaultValue?: string) => any, actions: {
    add(lang: string, table: Record<string, any>): void;
    locale: (lang?: string) => string;
    dict: (lang: string) => Record<string, Record<string, any>>;
}];

type I18nFormatOptions = Record<string, string | number>;
type I18nObject = {
    readonly [x: string]: string | ((...args: any) => any) | I18nObject;
};
type I18nFormatArgs = Record<string, string | number>;
type I18nPath<T extends I18nObject> = {
    [K in keyof T]: T[K] extends I18nObject ? I18nPath<T[K]> : T[K] extends (options: infer OptionsArgs) => string ? (options: OptionsArgs) => string : (options?: I18nFormatArgs) => string;
};
type Dictionaries<T extends I18nObject> = {
    [key: string]: T;
};
type AddFunctionLengths<T> = T extends string ? string : T extends (...args: infer A) => unknown ? T & {
    __length: A["length"];
} : {
    [K in keyof T]: AddFunctionLengths<T[K]>;
};
type RemoveFunctionLengths<T> = T extends string ? string : T extends (args: infer A) => infer R ? (args: A) => R : {
    [K in keyof T]: RemoveFunctionLengths<T[K]>;
};
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type GuaranteeIdenticalSignatures<T extends Dictionaries<I18nObject>> = Record<keyof T, RemoveFunctionLengths<UnionToIntersection<AddFunctionLengths<T[keyof T]>>>>;
type ChainedI18n<T extends Dictionaries<I18nObject>> = [
    translate: I18nPath<T>[keyof T],
    utils: {
        locale: Accessor<keyof T>;
        setLocale: Setter<keyof T>;
        getDictionary: (locale?: keyof T) => T[keyof T];
    }
];
/**
 * Creates chained dictionaries with callable end paths. IE dictionaries.en.hello()
 *
 * @param dictionaries {Record<string, Record<string, string | Function>} objects to parse for translations. End paths can be a string or function that returns a string
 * @param [readFn=deepReadObject] {<T = any>(obj: Record<string, unknown>, path: string, defaultValue?: unknown) => T} - Read function used to read the dictionary
 * @returns dictionaries {Record<locale, Record<string, Function | Record<string, Function | etc>} chained dictionaries with callable end paths to get the translation.
 */
declare function createChainedI18nDictionary<T extends Dictionaries<I18nObject>>(dictionaries: T & GuaranteeIdenticalSignatures<T>, readFn?: <A = any>(obj: Record<string, unknown>, path: string, defaultValue?: unknown) => A): I18nPath<T & GuaranteeIdenticalSignatures<T>>;
/**
 * Creates a chained dictionary and manages the locale. Provides a proxy wrapper around translate so you can do chained calls that always returns with the current locale. IE t.hello()
 *
 * @param props {{ dictionaries: Record<string, Record<string, string | Function | Record<>>; locale: keyof dictionaries. IE 'en' | 'es' | 'fr'; readFn: <T = any>(obj: Record<string, unknown>, path: string, defaultValue?: unknown ) => T }}
 * @returns [{ translate: chained dictionary with current locale path }, { locale: Accessor for current locale, setLocale: (locale: keyof dictionaries): => void; getDictionary(locale?: keyof dictionaries) => dictionaries[locale] }]
 *
 * @example
 * const dictionaries = { en: { hello: "Hello {{ name }}! "}, fr: { hello: "Bonjour {{ name }}!" }}
 *
 * createChainedI18n({ dictionaries, locale: "en" })
 */
declare function createChainedI18n<T extends Dictionaries<I18nObject>>(props: {
    dictionaries: T & GuaranteeIdenticalSignatures<T>;
    locale: keyof T;
    readFn?: <A = any>(obj: Record<string, unknown>, path: string, defaultValue?: unknown) => A;
}): ChainedI18n<T>;
/**
 * Creates chained I18n state wrapped in a Context Provider to be shared with the app using the component tree.
 *
 * Wraps {@link createChainedI18n}
 *
 * @param props Props for createChainedI18n
 * @param setFallback Sets the context on creation for a global i18n.
 */
declare function createChainedI18nContext<T extends Dictionaries<I18nObject>>(props: Parameters<typeof createChainedI18n<T>>[0], setFallback: true): [I18nProvider: FlowComponent, useI18n: () => ChainedI18n<T>];
declare function createChainedI18nContext<T extends Dictionaries<I18nObject>>(props: Parameters<typeof createChainedI18n<T>>[0], setFallback?: boolean): [I18nProvider: FlowComponent, useI18n: () => ChainedI18n<T> | null];

export { Dictionaries, I18nContext, I18nContextInterface, I18nFormatOptions, I18nObject, I18nPath, createChainedI18n, createChainedI18nContext, createChainedI18nDictionary, createI18nContext, useI18n };
