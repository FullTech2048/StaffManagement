import { supabase } from "../lib/supabaseClient.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const getErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage;
  }

  return error.message || fallbackMessage;
};

const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to sign in."));
  }

  return data.session;
};

const getCurrentSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(getErrorMessage(error, "Unable to restore session."));
  }

  return session;
};

export const authService = {
  async signup({ email, fullName, password }) {
    const normalizedEmail = email.trim();
    const normalizedFullName = fullName.trim();

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        fullName: normalizedFullName,
        password,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error?.message || payload.message || "Unable to sign up.");
    }

    return login(normalizedEmail, password);
  },

  login,

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(getErrorMessage(error, "Unable to sign out."));
    }
  },

  getCurrentSession,

  async getAccessToken() {
    const session = await getCurrentSession();
    return session?.access_token || null;
  },
};
