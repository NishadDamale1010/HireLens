const fs = require("fs");

const pdfParse = require("pdf-parse");

const mammoth = require("mammoth");

const extractText = async (filePath, mimetype) => {
    const fileBuffer = fs.readFileSync(filePath);

    let text = "";

    // pdf
    if (mimetype === "application/pdf") {
        const data = await pdfParse(fileBuffer);

        text = data.text;
    }

    // docx
    else if (
        mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        const result = await mammoth.extractRawText({
            buffer: fileBuffer,
        });

        text = result.value;
    }

    else {
        throw new Error("Unsupported file type");
    }

    return text;
};

module.exports = extractText;