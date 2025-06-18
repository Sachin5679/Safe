# 🔐 Safe — A Cryptographically Secure Password Manager

**Safe** is a secure and full-stack password manager that allows users to store and retrieve encrypted website credentials. Built with **MongoDB**, **Node.js**, **React**, and **Express**, it prioritizes strong data security and a seamless user experience.

## 🛠 Tech Stack

### Frontend:

* **ReactJS**
* **TailwindCSS**

### Backend:

* **Node.js**
* **Express.js**
* **MongoDB** (Database)
* **Crypto** (AES-256-CTR encryption)
* **Bcrypt** (for hashing credentials)
* **JWT** (Authentication)

## ✨ Features

* 🔐 Cryptographically secure storage of website passwords
* 🔑 AES-256-CTR encryption for sensitive data
* 🧠 Passwords are encrypted before storage and decrypted only when requested
* 📄 Add a website and its password securely
* 👁️ Click on a website to reveal its decrypted password
* 🔒 JWT-based session management
* 🎨 Intuitive and responsive UI using React and TailwindCSS

## 🧠 What Makes It Secure?

* **AES-256-CTR encryption** ensures passwords are securely encrypted using the `crypto` module before being stored in MongoDB.
* **Bcrypt** is used to hash user authentication data (e.g., login system).
* **JWT** ensures secure user sessions.
* **Passwords are never stored in plaintext**, and decryption happens only on authenticated requests.

## 📦 How It Works

1. **User adds a website and password**

   * Password is encrypted with AES-256-CTR using Node's `crypto` library.
   * Encrypted data is saved to the MongoDB database.

2. **User clicks on a website name**

   * The encrypted password is fetched.
   * The backend decrypts it and sends the plaintext password securely to the frontend.

3. **Authentication and session handling**

   * JWT is used to manage and protect authenticated sessions.

## 🧑‍💻 Development Highlights

* ✅ Developed a secure, full-stack password manager using MERN stack
* 🔐 Prioritized data security using AES-256-CTR encryption via the `crypto` module
* 🛡️ Strengthened protection against vulnerabilities through cryptographic best practices
* 🎯 Designed a clean and intuitive UI with React & TailwindCSS for a smooth user experience


