import { z } from "zod";

export default function numberValidationMessages(name: string, min: number, max: number) {
    return z
        .number({message: `${name} should be a number.`})
        .int(`${name} should be a integer.`)
        .min(min, `${name} should at least be ${min}.`)
        .max(max, `${name} cannot be more than ${max}.`);
}