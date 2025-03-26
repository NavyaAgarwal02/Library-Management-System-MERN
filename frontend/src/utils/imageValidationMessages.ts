function imageValidationMessages() {
    return {
        validate: {
            checkFileType: (value: FileList) =>
                !value[0] ||
                ["image/png", "image/jpeg", "image/jpg"].includes(
                    value[0].type
                ) ||
                "Only JPG, JPEG and PNG file types are allowed.",
            checkFileSize: (value: FileList) =>
                !value[0] ||
                value[0].size <=
                    Number(import.meta.env.VITE_IMAGE_MAX_SIZE) * 1024 * 1024 ||
                "Max file size is 5MB."
        }
    };
}

export default imageValidationMessages;