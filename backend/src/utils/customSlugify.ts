import slugify from "slugify";

function customSlugify(text: string): string {
    return slugify(text, {
        lower: true,
        remove: /[',.!?]/g,
        replacement: "-",
        strict: true,
        locale: "en",
        trim: true
    });
}

export default customSlugify;
