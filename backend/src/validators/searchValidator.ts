import { z } from "zod";
import { textValidationMessages } from "../utils/index.js";
import { queryRegex } from "../utils/regex.js";

const searchValidator = z
    .object({
        query: textValidationMessages(
            "Query",
            2,
            60,
            queryRegex
        ),
    })
    .partial();

export default searchValidator;
