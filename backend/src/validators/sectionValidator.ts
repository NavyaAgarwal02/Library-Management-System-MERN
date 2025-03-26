import { z } from "zod";
import { textValidationMessages } from "../utils/index.js";
import { titleRegex, descriptionRegex } from "../utils/regex.js";

const sectionValidator = z
    .object({
        title: textValidationMessages(
            "Title",
            3,
            60,
            titleRegex
        ),
        description: textValidationMessages(
            "Description",
            10,
            240,
            descriptionRegex
        ),
    })
    .partial();

export default sectionValidator;
