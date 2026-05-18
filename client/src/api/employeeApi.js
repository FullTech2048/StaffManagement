const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error?.message || "Employee request failed.");
  }

  return payload.data;
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
    const response = await fetch(`${API_BASE_URL}/employees`);
    return parseResponse(response);
  },

  async createEmployee(values) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      body: buildEmployeeFormData(values),
    });

    return parseResponse(response);
  },

  async updateEmployee(id, values) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      body: buildEmployeeFormData(values),
    });

    return parseResponse(response);
  },

  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
    });

    return parseResponse(response);
  },
};
