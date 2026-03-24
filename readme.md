# Kanapka SSO

A lightweight Single Sign-On (SSO) server built with Node.js and Express, inspired by OAuth 2.0. It provides centralized authentication for apps on the `kanapka.eu` domain and beyond, with support for two-factor authentication and multi-account sessions.

---

## Features

- **OAuth 2.0-inspired flow** — simplified authorization code exchange with short-lived external tokens and long-lived internal sessions
- **Two-factor authentication (2FA)** — adds an extra layer of security for user accounts
- **Multi-account support** — users can be logged into multiple accounts simultaneously
- **JWT-based tokens** — RSA-signed JWTs for both internal sessions and external token exchange
- **JWKS endpoint** — exposes a public key endpoint so client apps can verify tokens independently
- **Rate limiting** — built-in request rate limiting via `express-rate-limit`
- **Email integration** — transactional email support via Nodemailer (e.g. for 2FA codes or account verification)
- **MongoDB backend** — data persistence via Mongoose

---

## Tech Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| Runtime          | Node.js (ESM)                            |
| Framework        | Express                                  |
| Database         | MongoDB (Mongoose)                       |
| Auth tokens      | JSON Web Tokens (jsonwebtoken, jwks-rsa) |
| Key format       | RSA 4096-bit (PEM + JWK via pem-jwk)     |
| Password hashing | bcryptjs                                 |
| Input validation | Joi                                      |
| Email            | Nodemailer                               |
| Dev server       | Nodemon                                  |

---

## How It Works

This SSO server acts as a central identity provider. Client applications redirect users here to authenticate. On success, the server issues a short-lived **external token** containing granted user data. Long-lived **internal session tokens** (stored as cookies) keep users logged in across visits.

```
| # |  Client App                         |  SSO Server                         |
---------------------------------------------------------------------------------
| 1 |  User connects                      |                                     |
|   |  ↓                                  |                                     |
| 2 |  No token found                     |                                     |
|   |  →   →   →   →   →   →   →   →   →  |  ↓                                  |
| 3 |                                     |  Redirect to SSO                    |
|   |                                     |  ↓                                  |
| 4 |                                     |  SSO long-term token present        |
|   |                                     |  ↓                                  |
| 5 |                                     |  User authorizes app & data         |
|   |                                     |  ↓                                  |
| 6 |                                     |  Short term token generated         |
|   |  ↓   ←   ←   ←   ←   ←   ←   ←   ←  |  ←                                  |
| 7 |  Redirect to client w/ token        |                                     |
|   |  ↓                                  |                                     |
| 8 |  Client checks token validity       |                                     |
|   |  ↓                                  |                                     |
| 9 |  Client decodes user data           |                                     |
---------------------------------------------------------------------------------
```

---

## Prerequisites

- **Node.js** v18 or later
- **MongoDB** instance (local or remote)
- **OpenSSL** (for key generation)
- An SMTP email server

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/szutciek/sso.git
cd sso
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the server

Copy the example config and fill in your values:

```bash
cp config.js.example config.js
```

Then edit `config.js`:

```js
export const server = {
  httpPort: 3000, // HTTP port to listen on
  wsPort: 3001, // WebSocket port (if used)
  baseUrl: "https://your-domain.com",
};

export const jwt = {
  secret: "your-jwt-secret",
  internalExpiresIn: 14 * 24 * 60 * 60, // 14 days (internal session)
  externalExpiresIn: 5 * 60, // 5 minutes (external token)
};

export const db = {
  authOn: true,
  host: "localhost",
  port: 27017,
  user: "dbuser",
  pwd: "dbpassword",
  name: "sso",
  params: "",
};

export const email = {
  host: "mail.yourdomain.com",
  port: 587,
  user: "noreply@yourdomain.com",
  password: "emailpassword",
};
```

### 4. Generate RSA keys

The server uses RSA-4096 keys to sign JWTs. Generate them in the `keys/` directory:

```bash
cd keys

# Generate private key
openssl genpkey -algorithm RSA -out rsa.key -pkeyopt rsa_keygen_bits:4096

# Derive public key
openssl rsa -pubout -in rsa.key -out rsa.key.pub
```

### 5. Start the server

```bash
npm start
```

The server will start with Nodemon and hot-reload on file changes.

---

## Project Structure

```
sso/
├── client/          # Frontend assets (Vue.js login UI)
├── controllers/     # Route handler logic
├── crud/            # Database read/write operations
├── keys/            # RSA key files (not committed)
├── middleware/      # Auth and validation middleware
├── models/          # Mongoose schemas
├── public/modules/  # Public JS modules served to the browser
├── routes/          # Express route definitions
├── utils/           # Shared utility functions
├── config.js        # Your local config (gitignored)
├── config.js.example
├── database.js      # MongoDB connection setup
└── index.js         # Server entry point
```

---

## Token Lifetime

| Token type         | Default lifetime | Purpose                                   |
| ------------------ | ---------------- | ----------------------------------------- |
| Internal (session) | 14 days          | Keeps the user logged into the SSO server |
| External           | 5 minutes        | Passed to client apps after login         |

These defaults can be changed in `config.js` under the `jwt` section.

---

## Security Notes

- Keep `rsa.key` (private key) and `config.js` out of version control — both are listed in `.gitignore`.
- Use a strong, random value for `jwt.secret`.
- Always run behind HTTPS in production — tokens are transmitted as cookies and in URLs.
- The `express-rate-limit` middleware is included to help mitigate brute-force attacks.
