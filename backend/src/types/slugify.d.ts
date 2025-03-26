declare module "slugify" {
    interface SlugifyOptions {
        replacement?: string;
        remove?: RegExp;
        lower?: boolean;
        strict?: boolean;
        locale?: string;
        trim?: boolean;
    }

    function slugify(input: string, options?: SlugifyOptions): string;
    export = slugify;
}