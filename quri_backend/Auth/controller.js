const {
  login,
  addAdmin,
  verifyEmailService,
  checkVerificationService,
  resendVerificationEmail,
} = require("./service.js");

const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await login(username, password);
    // console.log("Login Result: ",result)
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const AddAdmin = async (req, res) => {
  const { username, password, confirmPassword,role } = req.body;

  try {
    const result = await addAdmin(username, password, confirmPassword,role);
    res.status(200).json(result);
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(400).json({ message: error.message });
  }
};

const VerifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await verifyEmailService(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const CheckVerification = async (req, res) => {
  try {
    const result = await checkVerificationService(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const resendEmail = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Call the service function to resend the email
    const response = await resendVerificationEmail(username);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  Login,
  AddAdmin,
  VerifyEmail,
  CheckVerification,
  resendEmail
};
