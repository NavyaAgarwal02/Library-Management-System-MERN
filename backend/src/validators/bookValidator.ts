import { z } from "zod";
import { textValidationMessages } from "../utils/index.js";
import { titleRegex, nameRegex, descriptionRegex } from "../utils/regex.js";

const bookValidator = z
    .object({
        title: textValidationMessages(
            "Title",
            3,
            60,
            titleRegex
        ),
        author: textValidationMessages(
            "Author",
            3,
            60,
            nameRegex
        ),
        description: textValidationMessages(
            "Description",
            10,
            240,
            descriptionRegex
        ),
    })
    .partial();

export default bookValidator;