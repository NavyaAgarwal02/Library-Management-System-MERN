function textValidationMessages(name: string, minLen: number, maxLen: number, pat: RegExp) {
    return {
        required: `${name} is required.`,
        minLength: {
            value: minLen,
            message: `${name} must be at least ${minLen} characters long.`,
        },
        maxLength: {
            value: maxLen,
            message: `${name} must not exceed ${maxLen} characters.`,
        },
        pattern: {
            value: pat,
            message: `${name} can only have letters, digits and some special characters.`,
        },
    };
}

export default textValidationMessages;