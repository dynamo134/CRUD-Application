# CRUD Application

A crud application that allows for CRUD (Create, Read, Update, Delete) operations on user data, with the ability to send email of selected users info to a specific email. This application is built using Next.js for the frontend and Node.js for the backend.

## Features

- Create new users
- Read and display user data
- Update user information
- Delete users
- Select users and send email with their information
- Responsive UI with a modern design

## Technologies Used

### Frontend

- Next.js
- Axios
- react-toastify
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Nodemailer


### Installation
Clone the repository:

   ```sh
   git clone https://github.com/dynamo134/user-management-system.git
   ```

Navigate to the project directory:

   ```sh
   cd CRUD
   ```

Install the dependencies for both the frontend and backend:

   ```sh
    cd frontend
    npm install
   ```

   ```sh
    cd ../backend
    npm install
   ```

## Environment Variables
```sh
   MONGO_DB_URI=your_mongodb_connection_string
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
```

## Running the Application

Start the backend server:

```sh
   cd backend
   npm run dev
```

Start the frontend development server:

```sh
   cd frontend
   npm run dev
```

