import { z } from "zod";
import { textValidationMessages } from "../utils/index.js";
import {
    nameRegex,
    usernameRegex,
    emailRegex,
    passwordRegex
} from "../utils/regex.js";

const userValidator = z
    .object({
        name: textValidationMessages("Name", 3, 60, nameRegex),
        username: textValidationMessages("Username", 5, 32, usernameRegex),
        email: z
            .string({ message: "Email should be a string." })
            .email("Not a valid email")
            .regex(
                emailRegex,
                "Email can only have letters, digits and some special characters."
            ),
        password: textValidationMessages("Password", 8, 60, passwordRegex)
    })
    .partial();

export default userValidator;
