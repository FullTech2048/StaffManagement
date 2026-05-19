const authService = require("../services/authService");

const signup = async (req, res) => {
  const adminProfile = await authService.createAdmin(req.body);
  res.status(201).json({ data: adminProfile });
};

module.exports = {
  signup,
};
