import { authService } from "../services/authService.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || payload.error?.message || "Employee request failed.");
  }

  return payload.data;
};

const buildAuthHeaders = async () => {
  const accessToken = await authService.getAccessToken();

  if (!accessToken) {
    throw new Error("Authentication required");
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const buildEmployeeFormData = (values) => {
  const formData = new FormData();

  formData.append("full_name", values.full_name || "");
  formData.append("gender", values.gender || "");
  formData.append("date_of_birth", values.date_of_birth || "");
  formData.append("address", values.address || "");
  formData.append("card_number", values.card_number || "");

  if (values.photo instanceof File) {
    formData.append("photo", values.photo);
  }

  return formData;
};

export const employeeApi = {
  async listEmployees() {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: await buildAuthHeaders(),
    });
    return parseResponse(response);
  },

  async createEmployee(values) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: await buildAuthHeaders(),
      method: "POST",
      body: buildEmployeeFormData(values),
    });

    return parseResponse(response);
  },

  async updateEmployee(id, values) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: await buildAuthHeaders(),
      method: "PUT",
      body: buildEmployeeFormData(values),
    });

    return parseResponse(response);
  },

  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: await buildAuthHeaders(),
      method: "DELETE",
    });

    return parseResponse(response);
  },
};
