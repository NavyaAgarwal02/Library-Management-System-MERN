import { z } from "zod";

export default function textValidationMessages(name: string, min: number, max: number, pat: RegExp) {
    return z
        .string({message: `${name} should be a string.`})
        .min(min, `${name} should have at least ${min} characters.`)
        .max(max, `${name} can only be ${max} characters long.`)
        .regex(
            pat,
            `${name} can only have letters, digits and some special characters.`
        );
}