function EmployeeTable({ employees, onDelete, onEdit }) {
  if (employees.length === 0) {
    return (
      <div className="empty-state card">
        <h2>No active employees</h2>
        <p>Create an employee to start building the staff directory.</p>
      </div>
    );
  }

  return (
    <div className="card table-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>Active Employees</h2>
        </div>
        <span className="count-pill">{employees.length} active</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Full name</th>
              <th>Gender</th>
              <th>Date of birth</th>
              <th>Address</th>
              <th>Card number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td data-label="Photo">
                  {employee.photo_url ? (
                    <img className="employee-photo" src={employee.photo_url} alt={`${employee.full_name} profile`} />
                  ) : (
                    <div className="photo-placeholder">No photo</div>
                  )}
                </td>
                <td data-label="Full name">{employee.full_name}</td>
                <td data-label="Gender">{employee.gender || "-"}</td>
                <td data-label="Date of birth">{employee.date_of_birth || "-"}</td>
                <td data-label="Address">{employee.address || "-"}</td>
                <td data-label="Card number">{employee.card_number}</td>
                <td data-label="Actions">
                  <div className="action-row">
                    <button className="secondary-button" type="button" onClick={() => onEdit(employee)}>
                      Edit
                    </button>
                    <button className="danger-button" type="button" onClick={() => onDelete(employee)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
