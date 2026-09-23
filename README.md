# Auto Code

## Overview

A web app created to help car owners catch their error codes and damaged parts to replace.
The app is designed to make a bridge between Cars and software.

## Screenshots



## Technologies Used

1. **Node.js** / Express.js — Backend framework
2. **MongoDB** — Database (Mongoose ODM)
3. **Bcrypt** — Password security
4. **EJS** — Templating engine
5. **CSS** — Styling

## Getting Started

"terminal
# 1. Clone the repo
git clone https://github.com/z8kwfdw5vc-arch/AutoCode.git
cd AutoCode

# 2. Install dependencies
npm install

# 3. Setup environment variables
# Create a .env file:
MONGO_URI=your_mongodb_connection_string
PORT=3000

# 4. Run the app
npm start
```

## User Stories

- As a user, I want to enter an OBD-II code and get instant diagnostic info (problem + solution).
- As a user, I want unknown codes to be automatically saved and profiled so the database grows over time.
- As a user, I want to view and manage my garage (vehicles).
- As a user, I want a clean, simple interface to navigate between Home, Garage, and System views.

## Database Design

### `ObdCode` Model

| Field | Type | Description |
|-------|------|-------------|
| `code` | String | OBD-II code (unique, uppercase) e.g. `P0300` |
| `name` | String | Code name/label |
| `category` | String | Category (P, B, C, U) |
| `problem` | String | Description of the problem |
| `solution` | String | Recommended fix |
| `ghost_fix` | String | Auto-generated note when code is new |
| `source` | String | Default: `mongoose_core_database` |
| `timestamps` | Auto | `createdAt` & `updatedAt` |

## Routes


| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home page |
| GET | `/auth/sign-up` | Show registration form |
| POST | `/auth/sign-up` | Register a new user |
| GET | `/auth/sign-in` | Show login form |
| POST | `/auth/sign-in` | Authenticate user session |
| GET | `/listings` | List all vehicle listings / garage entries |
| GET | `/listings/new` | Show form to add a new listing |
| POST | `/listings` | Create a new listing |
| GET | `/listings/:id` | View specific listing details |
| GET | `/listings/:id/edit` | Show edit listing form |
| PUT | `/listings/:id` | Update listing details |
| DELETE | `/listings/:id` | Delete a listing |
| GET | `/agent/dashboard` | Secret agent control center & live logs |
| POST | `/agent/action` | Execute custom agent commands |
| POST | `/agent/diagnostics` | Run autonomous system OBD-II checks |
| POST | `/agent/grant-access` | Grant permanent/temporary user permissions |

## Features

- **Instant OBD-II Lookup** — search any code and get full diagnostic info
- **Auto-Profile Generation** — unknown codes are auto-generated and saved to the DB
- **Smart Database** — grows automatically with every new code searched
- **Garage View** — manage your vehicles
- **MVC Architecture** — clean separation of concerns

## Future Enhancements

- [ ] User authentication (Sign up / Sign in)
- [ ] Owners can manage their own garage entries
- [ ] Admin dashboard to review all saved codes
- [ ] Edit/Delete OBD codes from the system panel
- [ ] Soft delete for removed records
- [ ] API integration with real OBD databases
- [ ] Mobile-responsive dark mode UI
- [ ] Track parts availability across multiple stores

## Credits

Built by YOUSIF MONDEGAR
