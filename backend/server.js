require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: "myuser",
  password: "123456",
  server: "localhost",
  port: 1433,
  database: "nextapp_db",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function connectDB() {
  try {
    pool = await sql.connect(config);
    console.log("DB CONNECTED");
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
    setTimeout(connectDB, 5000);
  }
}

connectDB();

app.post("/api/auth/signup", async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: "Database not ready" });

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashed)
      .query(
        "INSERT INTO Users (Name, Email, PasswordHash) VALUES (@name, @email, @password)"
      );

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  try {
    if (!pool) return res.status(503).json({ error: "Database not ready" });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM Users WHERE Email = @email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.recordset[0];
    const match = await bcrypt.compare(password, user.PasswordHash);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.Id, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.Id,
        name: user.Name,
        email: user.Email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});