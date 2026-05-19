const employeeService = require("../services/employeeService");

const listEmployees = async (req, res) => {
  const employees = await employeeService.listEmployees();
  res.json({ data: employees });
};

const getEmployee = async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  res.json({ data: employee });
};

const getEmployeePhotoUrl = async (req, res) => {
  const photoUrl = await employeeService.getEmployeePhotoUrl(req.params.id);
  res.json({ data: photoUrl });
};

const createEmployee = async (req, res) => {
  const employee = await employeeService.createEmployee(req.body, req.file);
  res.status(201).json({ data: employee });
};

const updateEmployee = async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body, req.file);
  res.json({ data: employee });
};

const deleteEmployee = async (req, res) => {
  await employeeService.softDeleteEmployee(req.params.id);
  res.json({ data: { success: true } });
};

module.exports = {
  createEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeePhotoUrl,
  listEmployees,
  updateEmployee,
};
