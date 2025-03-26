function pdfFileValidationMessages() {
    return {
        validate: {
            checkFileType: (value: FileList) =>
                !value[0] ||
                value[0].type === "application/pdf" ||
                "Only PDF file types are allowed.",
            checkFileSize: (value: FileList) =>
                !value[0] ||
                value[0].size <=
                    Number(import.meta.env.VITE_PDF_MAX_SIZE) * 1024 * 1024 ||
                "Max file size is 25MB."
        }
    };
}

export default pdfFileValidationMessages;