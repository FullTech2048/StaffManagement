const supabase = require("../config/supabase");
const { randomUUID } = require("crypto");
const ApiError = require("../utils/ApiError");
const { createSignedPhotoUrl, uploadEmployeePhoto } = require("./photoService");

const EMPLOYEE_COLUMNS =
  "id,photo_path,full_name,gender,date_of_birth,address,card_number,is_active,created_at,updated_at";

const normalizeText = (value) => {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const normalizeEmployeePayload = (body, { partial = false } = {}) => {
  const fields = ["full_name", "gender", "date_of_birth", "address", "card_number"];
  const payload = {};

  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = normalizeText(body[field]);
    } else if (!partial) {
      payload[field] = null;
    }
  }

  return payload;
};

const validateCreatePayload = (payload) => {
  if (!payload.full_name) {
    throw new ApiError(400, "Full name is required.");
  }

  if (!payload.card_number) {
    throw new ApiError(400, "Card number is required.");
  }
};

const ensureEmployeeExists = async (id) => {
  const { data, error } = await supabase
    .from("employees")
    .select("id")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new ApiError(404, "Employee not found.");
  }
};

const handleEmployeeError = (error) => {
  if (!error) {
    return;
  }

  if (error.code === "23505") {
    throw new ApiError(409, "Card number already exists.");
  }

  throw new ApiError(502, "Database operation failed.", error.message);
};

const withSignedPhotoUrl = async (employee) => {
  if (!employee) {
    return null;
  }

  return {
    ...employee,
    photo_url: await createSignedPhotoUrl(employee.photo_path),
  };
};

const listEmployees = async () => {
  const { data, error } = await supabase
    .from("employees")
    .select(EMPLOYEE_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  handleEmployeeError(error);

  return Promise.all((data || []).map(withSignedPhotoUrl));
};

const getEmployeeById = async (id) => {
  const { data, error } = await supabase
    .from("employees")
    .select(EMPLOYEE_COLUMNS)
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new ApiError(404, "Employee not found.");
  }

  return withSignedPhotoUrl(data);
};

const createEmployee = async (body, photo) => {
  const payload = normalizeEmployeePayload(body);
  validateCreatePayload(payload);

  payload.id = randomUUID();

  if (photo) {
    payload.photo_path = await uploadEmployeePhoto(payload.id, photo);
  }

  const { data: createdEmployee, error: createError } = await supabase
    .from("employees")
    .insert(payload)
    .select(EMPLOYEE_COLUMNS)
    .single();

  handleEmployeeError(createError);

  return withSignedPhotoUrl(createdEmployee);
};

const updateEmployee = async (id, body, photo) => {
  await ensureEmployeeExists(id);

  const payload = normalizeEmployeePayload(body, { partial: true });

  if (Object.prototype.hasOwnProperty.call(payload, "full_name") && !payload.full_name) {
    throw new ApiError(400, "Full name cannot be empty.");
  }

  if (Object.prototype.hasOwnProperty.call(payload, "card_number") && !payload.card_number) {
    throw new ApiError(400, "Card number cannot be empty.");
  }

  if (photo) {
    payload.photo_path = await uploadEmployeePhoto(id, photo);
  }

  const { data, error } = await supabase
    .from("employees")
    .update(payload)
    .eq("id", id)
    .eq("is_active", true)
    .select(EMPLOYEE_COLUMNS)
    .single();

  handleEmployeeError(error);

  return withSignedPhotoUrl(data);
};

const softDeleteEmployee = async (id) => {
  await ensureEmployeeExists(id);

  const { error } = await supabase
    .from("employees")
    .update({ is_active: false })
    .eq("id", id)
    .eq("is_active", true);

  handleEmployeeError(error);
};

module.exports = {
  createEmployee,
  getEmployeeById,
  listEmployees,
  softDeleteEmployee,
  updateEmployee,
};
