# 🚗 WayWise – Smart Travel & Fare Comparison Platform

<p align="center">
  <strong>Making everyday commuting simpler, smarter and more transparent.</strong>
</p>

<p align="center">
  <a href="https://ride-wise-xi.vercel.app/">Live Website</a>
</p>

---

## 📌 About the Project

**WayWise** is a full-stack web application designed to simplify everyday commuting by helping users explore routes and compare estimated travel fares across different vehicle categories.

The idea behind WayWise originated from a real-life commuting problem: the challenges of finding suitable cab routes and comparing travel costs. What started as an idea to address an everyday inconvenience developed into a collaborative group project.

Developed as part of the **3rd Semester Web Development course at BML Munjal University**, WayWise gave us the opportunity to transform a practical problem into a functional web application.

Our goal is to make travel planning more convenient by bringing route information and fare comparisons together in one platform.

## ✨ Key Features

- **Route Calculation:** Calculate travel distance and estimated duration using the Mappls API.
- **Fare Comparison:** Compare estimated fares across different vehicle categories.
- **Fare Breakdown:** View estimated travel costs, including applicable fees, taxes and toll amounts.
- **Booking Management:** Create and manage booking records through the application.
- **Database Integration:** MongoDB integration for storing and retrieving booking data.
- **Responsive Design:** Accessible through both desktop and mobile devices.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript | Application logic |
| Vite | Frontend development and build tool |
| Node.js | Backend runtime |
| Express.js | Backend API development |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modelling |
| Mappls API | Route calculation and distance estimation |
| CSS | Styling and responsive design |
| Vercel | Frontend deployment |
| Render | Backend deployment |

## 🏗️ Application Architecture

WayWise follows a client-server architecture.

1. **Frontend:** The React application handles the user interface and user interactions.
2. **Backend:** The Express.js server processes API requests and application logic.
3. **Route Integration:** The Mappls API provides route distance and duration information.
4. **Fare Calculation:** The application uses route information and vehicle-specific pricing rules to calculate estimated fares.
5. **Database:** MongoDB Atlas and Mongoose support booking data storage and retrieval.

## ⚙️ Getting Started

Follow these steps to run WayWise locally.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- A MongoDB Atlas account
- A Mappls developer account and an appropriate API key

### 1. Clone the repository

```bash
git clone https://github.com/hanshika1706/RideWise.git
```

### 2. Navigate to the project directory

```bash
cd RideWise/waywise
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the frontend/backend project root (the directory containing `package.json`).

Add the required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
VITE_MAPPLS_KEY=your_mappls_api_key
PORT=4000
```

If your frontend code uses a configurable backend URL, also add:

```env
VITE_API_URL=http://localhost:4000
```

**Important:** Replace the placeholder values with your own credentials. Never commit your actual `.env` file or expose database credentials in the repository.

### 5. Start the application

```bash
npm run dev
```

This starts the frontend and backend development servers.

Open the frontend in your browser:

```text
http://localhost:5173
```

The backend runs locally on port 4000.

## 🌐 Live Deployment

WayWise is deployed and accessible online.

- **Live Application:** https://ride-wise-xi.vercel.app/
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** MongoDB Atlas

## 📚 Learning Outcomes

Working on WayWise provided practical experience in:

- Building a full-stack web application.
- Developing REST APIs using Node.js and Express.js.
- Integrating third-party APIs for real-world functionality.
- Connecting a backend application to MongoDB Atlas using Mongoose.
- Managing frontend-backend communication.
- Debugging and handling API errors.
- Deploying frontend and backend applications.
- Understanding collaborative development through a group project.

## 👥 Team & Contributions

**Academic Context:** 3rd Semester – Web Development Course  
**Institution:** BML Munjal University  
**Project Type:** Group Project

The initial concept and problem identification behind WayWise were my own, inspired by everyday commuting challenges. The project was subsequently planned, developed and implemented collaboratively by the team.

**Team Members:**
- Hanshika
- Suhani
- Arzoo
- Pari
- Prince

*Add the names and GitHub profiles of all contributors here.*

## 🚀 Future Scope

Some potential improvements for WayWise include:

- Live vehicle availability and tracking.
- Integration with additional map and navigation services.
- More advanced route comparison options.
- Enhanced booking management.
- Improved fare estimation using real-time travel conditions.
- Additional transport categories and features.

## 💡 Final Note

WayWise represents an attempt to turn an everyday commuting challenge into a practical technology solution.

What began as an idea became an opportunity to learn, collaborate, build and deploy a full-stack application.

**Built with curiosity, collaboration and the idea of making everyday travel simpler.** ❤️

---

⭐ If you find this project interesting, feel free to explore the live application and repository!
