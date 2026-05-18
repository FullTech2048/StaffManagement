import { useEffect, useState } from "react";

const emptyForm = {
  photo: null,
  full_name: "",
  gender: "",
  date_of_birth: "",
  address: "",
  card_number: "",
};

const genderOptions = ["Female", "Male", "Other", "Prefer not to say"];

function EmployeeForm({ employee, isSubmitting, onCancelEdit, onSubmit }) {
  const [values, setValues] = useState(emptyForm);
  const [validationError, setValidationError] = useState("");

  const isEditMode = Boolean(employee);

  useEffect(() => {
    if (!employee) {
      setValues(emptyForm);
      setValidationError("");
      return;
    }

    setValues({
      photo: null,
      full_name: employee.full_name || "",
      gender: employee.gender || "",
      date_of_birth: employee.date_of_birth || "",
      address: employee.address || "",
      card_number: employee.card_number || "",
    });
    setValidationError("");
  }, [employee]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.full_name.trim()) {
      setValidationError("Full name is required.");
      return;
    }

    if (!values.card_number.trim()) {
      setValidationError("Card number is required.");
      return;
    }

    setValidationError("");
    await onSubmit(values);

    if (!isEditMode) {
      event.target.reset();
      setValues(emptyForm);
    }
  };

  return (
    <form className="employee-form card" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isEditMode ? "Edit employee" : "New employee"}</p>
          <h2>{isEditMode ? values.full_name : "Add Employee"}</h2>
        </div>
        {isEditMode ? (
          <button className="secondary-button" type="button" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
      </div>

      {validationError ? <div className="inline-error">{validationError}</div> : null}

      {isEditMode && employee.photo_url ? (
        <div className="current-photo">
          <img src={employee.photo_url} alt={`${employee.full_name} current profile`} />
          <span>Current photo</span>
        </div>
      ) : null}

      <label>
        Photo
        <input accept="image/jpeg,image/png,image/webp" name="photo" type="file" onChange={handleChange} />
      </label>

      <label>
        Full name <span className="required">*</span>
        <input name="full_name" required type="text" value={values.full_name} onChange={handleChange} />
      </label>

      <label>
        Gender
        <select name="gender" value={values.gender} onChange={handleChange}>
          <option value="">Select gender</option>
          {genderOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date of birth
        <input name="date_of_birth" type="date" value={values.date_of_birth} onChange={handleChange} />
      </label>

      <label>
        Address
        <textarea name="address" rows="3" value={values.address} onChange={handleChange} />
      </label>

      <label>
        Card number <span className="required">*</span>
        <input name="card_number" required type="text" value={values.card_number} onChange={handleChange} />
      </label>

      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : isEditMode ? "Update Employee" : "Create Employee"}
      </button>
    </form>
  );
}

export default EmployeeForm;
