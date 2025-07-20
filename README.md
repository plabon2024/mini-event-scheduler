# Event Management Site

A full-stack web application for managing events, built with **React**, **TypeScript**, **Node.js/Express**, **MongoDB**, and **Tailwind CSS**. This project was developed as a job task to demonstrate proficiency in creating RESTful APIs, implementing AI-driven event categorization, and delivering a responsive, user-friendly interface.

## Features

- **Event Creation**: Add events with title, date, time, and optional notes via a responsive form.
- **AI-Driven Categorization**: Automatically categorizes events as "Work," "Personal," or "Other" based on keywords in the title and notes.
- **CRUD Operations**: Create, read, update, and delete events using RESTful APIs.
- **Responsive UI**: Built with Tailwind CSS for a modern, visually appealing design.
- **User Feedback**: SweetAlert2 provides polished success, error, and confirmation dialogs for form submissions and deletions.
- **TypeScript**: Ensures type safety across frontend and backend for maintainable code.
- **MongoDB Integration**: Stores events securely in a MongoDB database.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, SweetAlert2
- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Database**: MongoDB Atlas
- **Other Libraries**: UUID (for unique event IDs), CORS, dotenv



## Setup and Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB Atlas** account for database hosting
- **Git** for cloning the repository

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/server` with the following:
   ```
   PORT=3000
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   ```
   Replace `your_mongodb_username` and `your_mongodb_password` with your MongoDB Atlas credentials.
4. Run the backend:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`.

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `/client` with:
   ```
   VITE_baseUrl=http://localhost:3000
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000` (or the port specified in `vite.config.ts`).

## API Endpoints

### `POST /events`
Creates a new event and automatically assigns a category based on AI Categorization.

- **Request Body**:
  ```json
  {
    "title": "string",
    "date": "YYYY-MM-DD",
    "time": "h:mm AM/PM",
    "notes": "string" // optional
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "id": "uuid",
    "title": "string",
    "date": "YYYY-MM-DD",
    "time": "h:mm AM/PM",
    "notes": "string",
    "category": "Work | Personal | Other",
    "archived": false,
    "_id": "mongo_id"
  }
  ```
- **Validation**:
  - `title`, `date`, and `time` are required.
  - `date` must be in `YYYY-MM-DD` format.
  - `time` must be in `h:mm AM/PM` format (e.g., "2:30 PM").
  - Returns `400 Bad Request` if validation fails.

- **AI Categorization**:
  The `categorizeEvent` function assigns a category based on keywords in `title` and `notes`:
  - **Work**: Contains keywords like "meeting," "project," "client," "work," "deadline."
  - **Personal**: Contains keywords like "birthday," "family," "party," "vacation," "friend."
  - **Other**: Default if no keywords match.

### GET /events

Fetches all scheduled events from the database, sorted by date and time (ascending).

### URL

`GET /events`

### Response Codes

| Status Code | Meaning                  |
|-------------|--------------------------|
| 200         | Events fetched successfully. |
| 404         | No events found.             |
| 500         | Internal server error.       |

### Success Response

**Status:** `200 OK`

**Example JSON Response:**

```json
{
  "message": "Events fetched successfully.",
  "data": [
    {
      "_id": "64ac98db3f34d6c9f8bc1b7d",
      "title": "Project Meeting",
      "date": "2025-07-21",
      "time": "14:00",
      "notes": "Discuss project timeline"
    },
    {
      "_id": "64ac98db3f34d6c9f8bc1b7e",
      "title": "Doctor Appointment",
      "date": "2025-07-22",
      "time": "10:00",
      "notes": ""
    }
  ]
}


