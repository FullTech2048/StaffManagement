const supabase = require("../config/supabase");
const ApiError = require("../utils/ApiError");
const { sendAdminWelcomeEmail } = require("./emailService");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const validateSignupPayload = ({ email, fullName, password }) => {
  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  if (!fullName) {
    throw new ApiError(400, "Full name is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }
};

const createAdmin = async (body) => {
  const email = normalizeText(body.email).toLowerCase();
  const fullName = normalizeText(body.fullName);
  const password = body.password || "";

  validateSignupPayload({ email, fullName, password });

  const {
    data: { user },
    error: createUserError,
  } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (createUserError || !user) {
    throw new ApiError(400, createUserError?.message || "Unable to create admin account.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .insert({
      user_id: user.id,
      full_name: fullName,
      email,
    })
    .select("id,user_id,full_name,email,created_at,updated_at")
    .single();

  if (profileError) {
    await supabase.auth.admin.deleteUser(user.id);
    throw new ApiError(400, profileError.message || "Unable to create admin profile.");
  }

  await sendAdminWelcomeEmail({ email, fullName });

  return profile;
};

module.exports = {
  createAdmin,
};
