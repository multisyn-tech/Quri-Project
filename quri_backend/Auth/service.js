const db = require("../db/db.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cron = require("node-cron");
dotenv.config();
const secretKey = process.env.JWT_SECRET;
const localURL = process.env.LOCAL_URL;
const BaseURL = process.env.BASE_URL;

// Helper function to generate a random four-digit number
const usedIDs = new Set();
const generateRandomRestaurantID = () => {
  if (usedIDs.size >= 9000) {
    throw new Error(
      "All possible 4-digit IDs are used. Increase Number of digits from 4"
    );
  }
  let id;
  do {
    const uuid = crypto.randomUUID().replace(/\D/g, "");
    id = parseInt(uuid.slice(-4), 10);

    if (id < 1000 || id > 9999) id = null;
  } while (!id || usedIDs.has(id));

  usedIDs.add(id);
  return id;
};

//Restaurant Valid Role
const validRole = ["Restaurant", "Admin"];

// Helper function to generate a random restaurant name
const generateRandomRestaurantName = () => {
  const adjectives = [
    "Delicious",
    "Spicy",
    "Cozy",
    "Tasty",
    "Gourmet",
    "Fresh",
    "Savory",
    "Zesty",
    "Hearty",
  ];
  const nouns = [
    "Bistro",
    "Grill",
    "Kitchen",
    "Cafe",
    "Diner",
    "Eatery",
    "Spot",
    "Place",
    "Corner",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
};

// Login logic
const login = async (username, password) => {
  try {
    username = username.trim();
    password = password.trim();

    const [rows] = await db
      .promise()
      .query("SELECT * FROM restaurantadmins WHERE Username = ?", [username]);
    if (!rows || rows.length === 0) {
      throw new Error("Email does not exist");
    }

    const admin = rows[0];

    // Check if the account is verified
    if (!admin.isVerified) {
      throw new Error(
        "Account not verified. Please verify your email before logging in."
      );
    }

    // Compare the plain text password with the hashed password
    const passwordMatch = await bcrypt.compare(password, admin.Password);
    if (!passwordMatch) {
      throw new Error("Invalid password or email");
    }


    // Generate a JWT token with RestaurantID
    const token = jwt.sign(
      {
        username: admin.Username,
        id: admin.AdminID,
        restaurantId: admin.RestaurantID,
        role: admin.Role,
      },
      secretKey,
      { expiresIn: "8h" }
    );

    return {
      message: "Login successful",
      token,
      restaurantId: admin.RestaurantID,
      role: admin.Role,
    };
  } catch (error) {
    throw error;
  }
};

const addAdmin = async (username, password, confirmPassword, role) => {
  try {
    // Validate password length
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Validate that password and confirmPassword match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Validate role
    if (!role) {
      throw new Error("Role is required");
    }

    // Normalize the role to lowercase and check if it's valid
    const normalizedRole = role.toLowerCase();

    if (!validRole.some((r) => r.toLowerCase() === role.toLowerCase())) {
      throw new Error(
        "Invalid role. Role must be either 'admin' or 'restaurant'"
      );
    }

    // Check if the username already exists
    const [existingAdmins] = await db
      .promise()
      .query("SELECT * FROM restaurantadmins WHERE username = ?", [username]);
    if (existingAdmins.length > 0) {
      throw new Error("Email already exists");
    }

    // Generate Restaurant ID and name
    const restaurantID = generateRandomRestaurantID();
    const restaurantName = generateRandomRestaurantName();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Insert the admin with the verification token, role, and unverified status
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO restaurantadmins (username, password, RestaurantID, verificationToken, Role, isVerified) VALUES (?, ?, ?, ?, ?, 0)",
        [
          username,
          hashedPassword,
          restaurantID,
          verificationToken,
          normalizedRole,
        ]
      );

    // if (["restaurant", "admin"].includes(normalizedRole)) {
      const insertRestaurantQuery =
        "INSERT INTO restaurants (RestaurantID, RestaurantName, Address, PhoneNumber, CreatedAt) VALUES (?, ?, null, null, NOW())";
      await db
        .promise()
        .query(insertRestaurantQuery, [restaurantID, restaurantName]);
    // }

    // Send verification email
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com", // Zoho SMTP server
      port: 587, // or 587 if you want to use TLS
      secure: false, // true for port 465 (SSL), false for port 587 (TLS)
      auth: {
        user: process.env.EMAIL_USERNAME, // your Zoho email address
        pass: process.env.EMAIL_PASSWORD, // your Zoho email password
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log("Error in SMTP configuration:", error);
      } else {
        console.log("SMTP server is ready to send messages:", success);
      }
    });

    let info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: username,
      subject: "Please confirm your email",
      html: `<a href="${localURL}/admins/VerifyEmail/${verificationToken}">Click here to confirm your email.</a>`,
    });

    return { message: "Admin added successfully. Please verify your email." };
  } catch (error) {
    throw error;
  }
};

/**
 * Verifying email
 */
const verifyEmailService = async (token) => {
  try {
    const [admin] = await db
      .promise()
      .query("SELECT * FROM restaurantadmins WHERE verificationToken = ?", [
        token,
      ]);

    if (admin.length === 0) {
      throw new Error("Invalid or expired verification link.");
    }

    // Update the admin record to set isVerified to true and clear the token
    await db
      .promise()
      .query(
        "UPDATE restaurantadmins SET isVerified = 1, verificationToken = NULL WHERE verificationToken = ?",
        [token]
      );

    return { message: "Email verified successfully. You can now login." };
  } catch (error) {
    throw new Error("An error occurred while verifying the email.");
  }
};

/**
 * Check Verification
 */

const checkVerificationService = async (req, res) => {
  if (!req.session || !req.session.admin) {
    return res
      .status(400)
      .send("Session not established or admin not logged in.");
  }

  try {
    const [admin] = await db
      .promise()
      .query("SELECT * FROM restaurantadmins WHERE id = ?", [
        req.session.admin.id,
      ]);

    if (admin.length === 0) return res.status(400).send("Invalid session.");

    res.send({ verified: admin[0].isVerified });
  } catch (error) {
    res
      .status(500)
      .send("An error occurred while checking verification status.");
  }
};

/**
 * Resending an email to user.
 * if the user did not received an email
 * Resend the email to user.
 */

const resendVerificationEmail = async (username) => {
  try {
    // Fetch the admin from the database
    const [admins] = await db
      .promise()
      .query("SELECT * FROM restaurantadmins WHERE username = ?", [username]);

    if (admins.length === 0) {
      throw new Error("No admin found with this email.");
    }

    const admin = admins[0];

    // Check if the admin is already verified
    if (admin.isVerified) {
      throw new Error("This account has already been verified.");
    }

    // Generate a new verification token
    const newVerificationToken = crypto.randomBytes(32).toString("hex");

    // Update the verification token in the database
    await db
      .promise()
      .query(
        "UPDATE restaurantadmins SET verificationToken = ? WHERE username = ?",
        [newVerificationToken, username]
      );

    // Send verification email
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.com", // Zoho SMTP server
      port: 587, // TLS port
      secure: false, // False for port 587
      auth: {
        user: process.env.EMAIL_USERNAME, // Your Zoho email
        pass: process.env.EMAIL_PASSWORD, // Your Zoho password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: username,
      subject: "Resend: Please confirm your email",
      html: `<a href="${localURL}/admins/VerifyEmail/${newVerificationToken}">Click here to confirm your email.</a>`,
    });

    return { message: "Verification email resent successfully." };
  } catch (error) {
    throw error;
  }
};

// cron.schedule("0 0 * * *", async () => {
//   const [admins] = await db.promise().query("SELECT RestaurantID FROM restaurantadmins");
  
//   console.log(admins)
  
//   for (const admin of admins) {
//     await db
//       .promise()
//       .query("UPDATE logs SET stage='completed' WHERE rest_id=?", [admin.RestaurantID]);
//   }
// });


module.exports = {
  login,
  addAdmin,
  verifyEmailService,
  checkVerificationService,
  resendVerificationEmail,
};
