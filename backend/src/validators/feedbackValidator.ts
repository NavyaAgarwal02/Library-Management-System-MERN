import { z } from "zod";
import {
    numberValidationMessages,
    textValidationMessages,
} from "../utils/index.js";
import { descriptionRegex } from "../utils/regex.js";

const feedbackValidator = z
    .object({
        rating: numberValidationMessages("Rating", 1, 5),
        content: textValidationMessages(
            "Content",
            10,
            240,
            descriptionRegex
        ),
    })
    .partial();

export default feedbackValidator;
