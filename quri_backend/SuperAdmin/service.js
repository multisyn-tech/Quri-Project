const db = require("../db/db.js");
const path = require('path');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secretKey = process.env.JWT_SECRET;
const localURL = process.env.LOCAL_URL;
const BaseURL = process.env.BASE_URL;



// Login logic
const login = async (username, password) => {
  try {
    username = username.trim();
    password = password.trim();

    console.log(`${username}, -- ${password}`)

    return
    const [rows] = await db
      .promise()
      .query("SELECT * FROM superadmin WHERE Username = ?", [username]);
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



// register a super-admin
const register = async (username, password, confirmPassword, role) => {
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

    return;

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



const generateRandomRestaurantID = async () => {
  let isUnique = false;
  let restaurantID;

  while (!isUnique) {

    restaurantID = Math.floor(1000 + Math.random() * 9000);

    const [rows] = await db
      .promise()
      .query(`SELECT RestaurantID FROM restaurantadmins WHERE RestaurantID = ?`, [restaurantID]);

    if (rows.length === 0) {
      isUnique = true;
    }
  }

  return restaurantID;
};

// register restaurant by super admin side.
const registerRestaurantService = async (username, password, role, restName, address, phoneNumber) => {


  try {
    // Validate password length
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Validate role
    if (!role) {
      throw new Error("Role is required");
    }

    // Check if the username already exists
    const [existingAdmins] = await db
      .promise()
      .query("SELECT * FROM restaurantadmins WHERE username = ?", [username]);
    if (existingAdmins.length > 0) {
      throw new Error("Email already exists");
    }

    // Generate Restaurant ID and name
    const restaurantID = await generateRandomRestaurantID();
    const restaurantName = restName;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const isVerified = 1;
    const status = "active"

    // Insert the restaurant with the verification token, role, and unverified status
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO restaurantadmins (username, password, RestaurantID, verificationToken, Role, isVerified) VALUES (?, ?, ?, ?, ?, ?)",
        [
          username,
          hashedPassword,
          restaurantID,
          verificationToken,
          role,
          isVerified,
        ]
      );


    const insertRestaurantQuery = `
      INSERT INTO restaurants 
      (RestaurantID, RestaurantName, Address, PhoneNumber, CreatedAt, status) 
      VALUES (?, ?, ?, ?, NOW(), ?)`;
    await db
      .promise()
      .query(insertRestaurantQuery,
        [
          restaurantID,
          restaurantName,
          address,
          phoneNumber,
          status
        ]);


    return { message: "Restaurant added successfully." };
  } catch (error) {
    throw error;
  }


}




//Fetch all restaurants Menu
const getAllRestaurantsMenus = async () => {
  try {
    // SQL query to fetch the restaurant and menu details
    const [rows] = await db.promise().query(`
        SELECT 
          ra.RestaurantID, 
          r.RestaurantName, 
          m.MenuID, 
          m.ItemName, 
          m.ItemDescription, 
          m.Price, 
          m.Image, 
          m.CategoryID, 
          m.MenuStatus,
          c.CategoryName
        FROM 
          restaurantadmins ra
        JOIN 
          restaurants r ON ra.RestaurantID = r.RestaurantID
        JOIN 
          menus m ON ra.RestaurantID = m.RestaurantID
        JOIN 
          categories c on m.CategoryID = c.CategoryID;
      `);

    // Group menus by RestaurantID
    const groupedMenus = rows.reduce((acc, menu) => {
      const { RestaurantID, RestaurantName, ...menuDetails } = menu;

      if (!acc[RestaurantID]) {
        acc[RestaurantID] = {
          RestaurantID,
          RestaurantName,
          menus: [],
        };
      }
      acc[RestaurantID].menus.push(menuDetails);

      return acc;
    }, {});

    // Return grouped menus as an array
    return Object.values(groupedMenus);
  } catch (error) {
    // Handle any errors that occur during query execution
    console.error("Error fetching restaurants' menus:", error);
    throw error;
  }
};

// Fetch all restaurant orders
const getAllRestaurantOrders = async () => {
  try {
    // SQL query to fetch the restaurant and order details
    const [rows] = await db.promise().query(`
       SELECT 
    ra.RestaurantID, 
    r.RestaurantName, 
    o.*, 
    od.*, 
    m.ItemName, 
    c.CategoryName
FROM 
    restaurantadmins ra
JOIN 
    restaurants r ON ra.RestaurantID = r.RestaurantID
JOIN 
    orders o ON ra.RestaurantID = o.RestaurantID
JOIN 
    orderdetails od ON o.OrderID = od.OrderID
JOIN 
    menus m ON od.MenuID = m.MenuID        
JOIN 
    categories c ON m.CategoryID = c.CategoryID ;
      `);

    // Group orders by RestaurantID
    const groupedOrders = rows.reduce((acc, order) => {
      const {
        RestaurantID,
        RestaurantName,
        OrderID,
        OrderDate,
        OrderStatus,
        TotalAmount,
        ...orderDetails
      } = order;

      if (!acc[RestaurantID]) {
        acc[RestaurantID] = {
          RestaurantID,
          RestaurantName,
          orders: {},
        };
      }

      // Group order details by OrderID
      if (!acc[RestaurantID].orders[OrderID]) {
        acc[RestaurantID].orders[OrderID] = {
          OrderID,
          OrderDate,
          OrderStatus,
          TotalAmount,
          orderDetails: [],
        };
      }

      acc[RestaurantID].orders[OrderID].orderDetails.push(orderDetails);

      return acc;
    }, {});

    // Convert grouped orders to an array with nested order details
    return Object.values(groupedOrders).map((restaurant) => ({
      ...restaurant,
      orders: Object.values(restaurant.orders),
    }));
  } catch (error) {
    // Handle any errors that occur during query execution
    console.error("Error fetching restaurants' orders:", error);
    throw error;
  }
};


// Fetch menu based on restaurant ID
const getMenuByRestaurantID = async (restaurantID) => {
  try {
    // SQL query to fetch menu based on restaurant ID
    const [rows] = await db.promise().query(`
      SELECT m.MenuID, m.ItemName, m.ItemDescription, m.Price, m.Image, m.CategoryID, m.MenuStatus, ra.RestaurantID, c.CategoryName
      FROM restaurantadmins ra
      JOIN menus m ON m.restaurantID = ra.RestaurantID
      JOIN categories c ON c.CategoryID = m.CategoryID
      WHERE ra.RestaurantID = ?;
    `, [restaurantID]);

    if (rows.length === 0) {
      return null;
    }

    const { RestaurantID, ...menuDetails } = rows[0];
    const menuItems = rows.map(({ RestaurantID, ...menu }) => menu);

    return {
      RestaurantID,
      menuItems
    };
  } catch (error) {
    // Handle any errors that occur during query execution
    console.error("Error fetching menu by restaurant ID:", error);
    throw error;
  }
};

// Edit Menu Item
const editMenuItem = async (menuId, data, file) => {
  const { ItemName, ItemDescription, Price, Image, MenuStatus } = data;

  console.log("Received MenuStatus:", MenuStatus);
  console.log("Received file:", file);
  console.log("Menu ID:", menuId);

  // Validate MenuStatus
  const validMenuStatuses = ["active", "inactive"];
  if (!validMenuStatuses.includes(MenuStatus)) {
    throw new Error("Invalid MenuStatus. Must be 'active' or 'inactive'");
  }

  try {
    let imageUrl;

    if (file) {
      // If a file was uploaded, save its path as the image URL
      imageUrl = `uploads/food/${path.basename(file.path)}`;
    } else if (Image && Image.startsWith("http")) {
      // If no file but Image URL is provided, use that
      imageUrl = Image;
    } else {
      throw new Error("Image is required either as a file or a URL.");
    }

    // Proceed with updating the menu item
    const [result] = await db.promise().query(
      `UPDATE menus 
         SET ItemName = ?, 
             ItemDescription = ?, 
             Price = ?, 
             Image = ?, 
             MenuStatus = ? 
         WHERE MenuID = ?`,
      [
        ItemName,
        ItemDescription,
        Price,
        imageUrl, // Use the generated or provided image URL
        MenuStatus,
        menuId,
      ]
    );

    return result.affectedRows > 0; // Returns true if the menu item was updated successfully
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw new Error(error.message);
  }
};




module.exports = {
  login,
  register,
  registerRestaurantService,

  getAllRestaurantsMenus,
  getAllRestaurantOrders,
  getMenuByRestaurantID,
  editMenuItem
};
