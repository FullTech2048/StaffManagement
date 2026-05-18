const path = require("path");
const { randomUUID } = require("crypto");
const supabase = require("../config/supabase");
const ApiError = require("../utils/ApiError");

const EMPLOYEE_PHOTOS_BUCKET = "employee-photos";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

const extensionByMimeType = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const getFileExtension = (file) => {
  const extension = extensionByMimeType[file.mimetype];

  if (extension) {
    return extension;
  }

  const originalExtension = path.extname(file.originalname || "").replace(".", "");
  return originalExtension || "bin";
};

const uploadEmployeePhoto = async (employeeId, file) => {
  if (!file) {
    return null;
  }

  const extension = getFileExtension(file);
  const photoPath = `employees/${employeeId}/${randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(EMPLOYEE_PHOTOS_BUCKET)
    .upload(photoPath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new ApiError(502, "Failed to upload employee photo.", error.message);
  }

  return photoPath;
};

const createSignedPhotoUrl = async (photoPath) => {
  if (!photoPath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(EMPLOYEE_PHOTOS_BUCKET)
    .createSignedUrl(photoPath, SIGNED_URL_TTL_SECONDS);

  if (error) {
    return null;
  }

  return data.signedUrl;
};

module.exports = {
  EMPLOYEE_PHOTOS_BUCKET,
  createSignedPhotoUrl,
  uploadEmployeePhoto,
};
