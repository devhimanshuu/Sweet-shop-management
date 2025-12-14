# Sweet Shop Management System

A robust, full-stack application for managing a sweet shop inventory, built with modern web technologies and following Test-Driven Development (TDD) principles.

## 🚀 Project Overview

This project is a Sweet Shop Management System that allows users to browse sweets, purchase items, and allows administrators to manage the inventory (add, restock, delete sweets). It features a secure RESTful API backend and a responsive, aesthetic React frontend.

## 🛠️ Technology Stack

**Backend:**

- **Language:** Node.js / TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Hosted on Supabase)
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Jest, Supertest

**Frontend:**

- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Components:** Radix UI (via Shadcn/like components)
- **HTTP Client:** Axios

## ✨ Features

- **User Authentication**: Secure Register and Login with JWT.
- **Sweet Inventory**: View all available sweets with rich details.
- **Search & Filter**: Real-time search by name, category, and price.
- **Purchasing System**: Users can purchase sweets (updates stock in real-time).
- **Admin Management**:
  - Add new sweets (with image URLs, categories, prices).
  - **Update**: Edit details of existing sweets.
  - **Restock**: Dedicated UI for increasing inventory.
  - **Delete**: Secure, confirmed deletion of items.
- **Responsive Design**: Beautiful UI with gradients, animations, and mobile/laptop compatibility.

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL installed and running.

### 1. Database Setup (Supabase)

1.  **Create a Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get Connection String**:
    - Go to **Project Settings** > **Database**.
    - Copy the **Connection String** (URI mode). It looks like: `postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres`
    - You will use this as your `DATABASE_URL`.
3.  **Run Schema**:
    - Go to the **SQL Editor** in Supabase.
    - Click **+ New Query**.
    - Copy the contents of `backend/database/schema.sql` from this repo.
    - Paste it and click **Run** to set up tables and default data.

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following variables:

    ```env
    PORT=5000
    DATABASE_URL=postgresql://postgres:password@localhost:5432/sweet_shop
    JWT_SECRET=your_super_secret_key_here
    NODE_ENV=development
    ```

    _(Adjust `DATABASE_URL` with your local credential)_

4.  Run Database Migrations (if applicable) or ensure the `sweets` and `users` tables are created as per `src/models` or `init.sql`.

5.  Start the server:
    ```bash
    npm start
    # OR for development
    npm run dev
    ```

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open your browser at `http://localhost:5173`.

## 🔐 Default Credentials

Use the following credentials to log in and test the application permissions:

| Role  | Email                 | Password   | Description                               |
| :---- | :-------------------- | :--------- | :---------------------------------------- |
| Admin | `admin@sweetshop.com` | `admin123` | Full access to inventory management.      |
| User  | `user@sweetshop.com`  | `user123`  | Can browse sweets and simulate purchases. |

## 🧪 Test Report

This project strictly follows TDD. The backend is fully tested with unit and integration tests.

![Description](assets/test_Img.png)

**Run Tests:**

```bash
cd backend
npm test
```

**Current Status:**

- **Test Suites**: 4 passed, 4 total
- **Tests**: 31 passed, 31 total
- **Coverage**: High coverage across Services and API endpoints.

## 🤖 My AI Usage

**AI Tools Used:**

- **ChatGPT (OpenAI)**: Used extensively throughout the project lifecycle.

**Usage Breakdown:**

- **Backend Development**:

  - Used AI to generate boilerplate code for controllers, routes, and services, accelerating the initial setup.
  - Assisted in writing logical implementations for `SweetService` and `AuthService`.
  - Helped fix JWT-based errors and implement production-level error handling.

- **Test-Driven Development (TDD)**:

  - AI generated boilerplate code for unit and integration tests (Auth, JWT, SweetService).
  - Provided inspiration for edge cases and error conditions to check during the "Red" phase.
  - Assisted in debugging and fixing failing tests to achieve the "Green" phase.

- **Frontend & UI**:
  - Enhanced UI responsiveness and design perspectives (colors, layout).
  - Generated boilerplate for React components, Context, and API services.
  - Assisted in refactoring components like `SweetCard` and implementing dialogs for Admin features.

**Reflection:**

Integrating AI into the workflow significantly accelerated the development process, particularly in the "Green" and "Refactor" phases of TDD. By handling repetitive boilerplate code for tests and backend structures, AI allowed me to focus on the core business logic and architectural decisions. It also proved invaluable for Frontend tasks, providing immediate design suggestions and fixing CSS responsiveness issues that would have otherwise taken hours to tweak manually. The collaboration ensured a more robust, well-tested, and visually appealing application.

## 📸 Screenshots

_(Add your screenshots here)_

- **Login View**
  ![Description](assets/Login_img.png)
- **Dashboard View**
  ![Description](assets/Dash_admin_Img.png)
- **Restock/Edit Modal**
  ![Description](assets/Restock_admin_Img.png)
  ![Description](assets/Edit_Admin_Img.png)
- **Mobile View**
  ![Description](assets/Register_Mob_Img.png)
  ![Description](assets/Add_mob_Img.png)

---

## 👨‍💻 Crafted By

<p align="center">
  <b>Himanshu Gupta</b><br>
  <i>Built with ❤️ &amp; Code</i>
</p>
