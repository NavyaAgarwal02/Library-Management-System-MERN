import { z } from "zod";
import { numberValidationMessages } from "../utils/index.js";

const requestValidator = z
    .object({
        days: numberValidationMessages("Days", 1, 7),
    })
    .partial();

export default requestValidator;
