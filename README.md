# Event Management Site

A full-stack **Event Management Web Application** built with **React**, **TypeScript**, **Node.js/Express**, **MongoDB**, and **Tailwind CSS**. This project features **AI-driven event categorization**, allowing automatic classification of events as **Work**, **Personal**, or **Other**, based on event title and notes content.

🔗 **Live Site**: [https://mini-event-scheduler-rust.vercel.app/](https://mini-event-scheduler-rust.vercel.app/)

---

## Features

* ✅ **AI-Driven Categorization**: Events are automatically categorized using simple keyword matching.
* ✅ **Event Creation**: Add events with title, date, time, and optional notes.
* ✅ **CRUD Operations**: Create, read, update, and delete events via RESTful API.
* ✅ **Archiving**: Events can be archived or updated.
* ✅ **Responsive UI**: Built using Tailwind CSS for clean design.
* ✅ **SweetAlert2 Integration**: For user notifications.
* ✅ **TypeScript**: Strongly typed frontend and backend.
* ✅ **MongoDB Atlas**: Secure cloud-based data storage.

---

## Tech Stack

| Frontend     | Backend           | Database      |
| ------------ | ----------------- | ------------- |
| React + Vite | Node.js + Express | MongoDB Atlas |
| TypeScript   | TypeScript        |               |
| Tailwind CSS | REST API          |               |
| SweetAlert2  | CORS, dotenv      |               |

---

## Live Demo

🌐 [https://mini-event-scheduler-rust.vercel.app/](https://mini-event-scheduler-rust.vercel.app/)

---

## Local Development Setup

### Prerequisites

* **Node.js** (v16+)
* **npm** (v8+)
* **MongoDB Atlas** account
* **Git**

---

### Backend Setup (`/server`)

1. Navigate to the backend folder:

   ```bash
   cd server
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in `/server`:

   ```env
   PORT=3000
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   ```
4. Run the backend:

   ```bash
   npm run dev
   ```
5. Backend will be running on:

   ```
   http://localhost:3000
   ```

---

### Frontend Setup (`/client`)

1. Navigate to the frontend folder:

   ```bash
   cd client
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in `/client`:

   ```env
   VITE_baseUrl=http://localhost:3000
   ```
4. Run the frontend:

   ```bash
   npm run dev
   ```
5. Access the app locally at:

   ```
   http://localhost:5173 (default Vite port)
   ```

---

## API Endpoints

### 1️⃣ **Create Event**

`POST /events`

**Request Body**:

```json
{
  "title": "string",
  "date": "YYYY-MM-DD",
  "time": "h:mm AM/PM",
  "notes": "string"   // optional
}
```

* **AI Categorization**:

  * Work: meeting, project, client, work, deadline
  * Personal: birthday, family, party, vacation, friend
  * Other: Default category

**Response** (`201 Created`):

```json
{
  "_id": "mongo_id",
  "title": "string",
  "date": "YYYY-MM-DD",
  "time": "h:mm AM/PM",
  "notes": "string",
  "category": "Work | Personal | Other",
  "archived": false
}
```

---

### 2️⃣ **Get All Events**

`GET /events`

**Returns:** All events sorted by date and time.

**Response** (`200 OK`):

```json
{
  "message": "Events fetched successfully.",
  "data": [
    {
      "_id": "mongo_id",
      "title": "string",
      "date": "YYYY-MM-DD",
      "time": "h:mm AM/PM",
      "notes": "string",
      "category": "Work | Personal | Other",
      "archived": false
    }
  ]
}
```

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | Events fetched        |
| 404         | No events found       |
| 500         | Internal server error |

---

### 3️⃣ **Update Event / Archive Event**

`PUT /events/:id`

**Request Body**: Fields to update (e.g. archived status or event details).
**Response**:

```json
{ "message": "Event archived successfully" }
```

---

### 4️⃣ **Delete Event**

`DELETE /events/:id`

**Response**:

```json
{ "message": "Event with id {id} deleted successfully." }
```

---


