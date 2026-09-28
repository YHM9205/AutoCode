# Auto Code

## Overview

A web app that helps car owners track their OBD-II error codes. Each car in your garage keeps its own code history, every code shows how serious it is, and a reports page shows which codes show up most.

## Screenshots

_Coming soon_

## Technologies Used

1. **Node.js** / Express 5 — Backend
2. **MongoDB** / Mongoose — Database
3. **Bcrypt** — Password hashing
4. **express-session** + **connect-mongo** — Sessions
5. **EJS** — Templates
6. **CSS** — Styling

## Getting Started

```sh
git clone https://github.com/z8kwfdw5vc-arch/AutoCode.git
cd AutoCode
npm install
```

Create a `.env` file:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=generate_a_long_random_secret
PORT=3000
```

Generate `SESSION_SECRET` with:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Seed the starter OBD codes, then run the app:

```sh
node seed/obdCodes.js
npm start
```

## User Stories

- As a user, I want to sign up and log in so my garage is private.
- As a user, I want to add my cars to my garage.
- As a user, I want to log an OBD-II code on a specific car so each car has its own fault history.
- As a user, I want to see how serious a code is: keep driving, visit a workshop soon, or stop the car now.
- As a user, I want one log of every code I've recorded across all my cars.
- As a user, I want to mark a code as fixed.
- As a user, I want to see the most common codes, overall and by car make.

## Severity Levels

| Level | Meaning |
|-------|---------|
| `drive` | Keep driving, fix when convenient |
| `soon` | Visit a workshop soon |
| `stop` | Stop the car now |
| `unknown` | Code isn't in the database yet |

## Database Design

### `User`
| Field | Type | Notes |
|-------|------|-------|
| `username` | String | unique |
| `email` | String | unique, lowercase |
| `password` | String | bcrypt hash |
| `role` | String | `user`, `owner`, `technician`, `admin` |

### `Owner`
| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → User | unique |
| `fullName` | String | |
| `phone` | String | |
| `garageName` | String | optional |

### `Car`
| Field | Type | Notes |
|-------|------|-------|
| `make` / `model` | String | |
| `year` | Number | |
| `vin` | String | optional, unique |
| `owner` | ObjectId → Owner | |

### `ObdCode`
| Field | Type | Notes |
|-------|------|-------|
| `code` | String | unique, e.g. `P0300` |
| `name` | String | |
| `category` | String | `P`, `B`, `C`, `U` |
| `problem` / `solution` | String | |
| `severity` | String | `drive`, `soon`, `stop` |

### `CodeLog`
| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId → User | who logged it |
| `car` | ObjectId → Car | which car |
| `code` | String | e.g. `P0420` |
| `severity` | String | copied from `ObdCode`, or `unknown` |
| `note` | String | optional |
| `resolved` | Boolean | marked fixed |

## Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home page |
| GET | `/auth/signup` | Sign-up form |
| POST | `/auth/signup` | Create account |
| GET | `/auth/login` | Login form |
| POST | `/auth/login` | Log in |
| GET | `/auth/logout` | Log out |
| GET | `/obd` | Browse / search OBD codes (`?q=P03`) |
| GET | `/garage` | My cars 🔒 |
| GET | `/garage/new` | Add car form 🔒 |
| POST | `/garage` | Create car 🔒 |
| GET | `/garage/logs` | All codes I've logged 🔒 |
| GET | `/garage/:id` | Car details + code history 🔒 |
| DELETE | `/garage/:id` | Delete car and its logs 🔒 |
| POST | `/garage/:id/logs` | Log a code on this car 🔒 |
| PUT | `/garage/:id/logs/:logId` | Mark fixed / reopen 🔒 |
| GET | `/reports` | Most common codes + by car make 🔒 |

🔒 = login required

## Project Structure

```
config/        DB config
controllers/   auth, index, obd, garage, report
middleware/    isSignedIn
models/        User, Owner, Car, ObdCode, CodeLog, ...
routes/        auth, index, obd, garage, report
seed/          starter OBD codes
views/         EJS templates (garage/, obd/, auth/, partials/)
public/        CSS
```

## Future Enhancements

- [ ] Admin page to add / edit OBD codes
- [ ] Read codes directly from a Bluetooth OBD-II scanner (ELM327)
- [ ] Link parts and prices to each code
- [ ] Charts on the reports page
- [ ] Mobile-responsive dark mode

## Credits

Built by YOUSIF MONDEGAR
