const CustomGQLError = require("../../graphql/errors/CustomGQLError");

  // detect file type
  const detectFileType = (ext) => {
    // image types
    const imageTypes = [".jpeg", ".jpg", ".png", ".gif", ".svg"];

    // document types
    const documentTypes = [".pdf", ".doc", ".docx", ".odt", ".rtf", ".txt", ".md"];

    // all allowed types
    const allowedTypes = [...imageTypes, ...documentTypes];

    // throw error if file type is not allowed
    if(!allowedTypes.includes(ext)) {
      throw new CustomGQLError(`Invalid file type, ${ext}`, "INVALID_FILE_TYPE");
    }

    // return file type
    if (imageTypes.includes(ext)) {
      return "image";
    }

    if (documentTypes.includes(ext)) {
      return "document";
    }

  }

  module.exports = detectFileType