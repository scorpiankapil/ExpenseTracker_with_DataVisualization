# ExpenseIQ: Expense Tracker with Data Visualization

B.Tech CSE 3rd Year Mini Project — Bridge Labzz

---

## About

ExpenseIQ is a full-stack web application for tracking personal expenses and income. It includes user authentication, transaction management, budget tracking, report generation, and data visualization using charts.

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Backend    | Node.js + Express.js    |
| Database   | MongoDB + Mongoose       |
| Auth       | JWT + bcryptjs          |
| Frontend   | EJS Templates           |
| Charts     | Chart.js                |
| Icons      | Feather Icons           |

---

## Project Structure

```
expenseiq/
├── app.js                         # Main server entry point
├── package.json
├── .env                           # Environment variables
├── models/
│   ├── User.js
│   ├── Transaction.js
│   └── Budget.js
├── controllers/
│   ├── authController.js
│   ├── transactionController.js
│   ├── budgetController.js
│   ├── reportController.js
│   └── profileController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── transactionRoutes.js
│   ├── budgetRoutes.js
│   ├── reportRoutes.js
│   └── profileRoutes.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── sidebar.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── transactions.ejs
│   ├── budget.ejs
│   ├── reports.ejs
│   ├── profile.ejs
│   └── settings.ejs
└── public/
    ├── css/
    │   └── style.css
    └── js/
        ├── charts.js
        └── main.js
```

---

## Getting Started

### 1. MongoDB Setup

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string.

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expenseiq
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Server

```bash
node app.js
```

For development with auto-reload:

```bash
npm run dev
```

### 5. Open in Browser

```
http://localhost:3000
```

---

## API Routes

### Auth

| Method | Route           | Description     |
|--------|-----------------|-----------------|
| GET    | /               | Home page       |
| GET    | /auth/login     | Login page      |
| POST   | /auth/login     | Login user      |
| GET    | /auth/register  | Register page   |
| POST   | /auth/register  | Register user   |
| GET    | /auth/logout    | Logout          |

### Transactions

| Method | Route                        | Description          |
|--------|------------------------------|----------------------|
| GET    | /dashboard                   | Dashboard            |
| GET    | /transactions                | List transactions    |
| POST   | /transactions/add            | Add transaction      |
| POST   | /transactions/edit/:id       | Edit transaction     |
| DELETE | /transactions/delete/:id     | Delete transaction   |

### Budget

| Method | Route             | Description        |
|--------|-------------------|--------------------|
| GET    | /budget           | Budget page        |
| POST   | /budget/set       | Set/Update budget  |
| DELETE | /budget/delete/:id| Delete budget      |

### Reports

| Method | Route            | Description    |
|--------|------------------|----------------|
| GET    | /reports         | Reports page   |
| GET    | /reports/export  | Export CSV     |

### Profile

| Method | Route            | Description      |
|--------|------------------|------------------|
| GET    | /profile         | Profile page     |
| POST   | /profile/update  | Update profile   |

