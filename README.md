# 🚗 WayWise – Smart Travel & Fare Comparison Platform

<p align="center">
  <strong>Making everyday commuting simpler, smarter and more transparent.</strong>
</p>

<p align="center">
  <a href="https://ride-wise-xi.vercel.app/">🌐 Live Website</a>
</p>

---

## 📌 About the Project

**WayWise** is a full-stack web application designed to simplify everyday commuting by helping users explore routes and compare estimated travel fares across different vehicle categories.

The idea originated from a real-life commuting problem: the challenges of finding suitable cab routes and comparing travel costs. What started as an idea to address an everyday inconvenience eventually developed into a collaborative group project.

Developed as part of the **3rd Semester Web Development course at BML Munjal University**, WayWise gave us an opportunity to transform a practical problem into a functional web application.

Our goal is to make travel planning more convenient by bringing route information, fare comparisons and booking functionality together in one platform.

## ✨ Key Features

### 1. Route Planning & Comparison
- Route calculation and distance estimation using the Mappls API.
- Alternative route options with filtering for fastest, lowest-cost and toll-free routes.
- Journey details including estimated distance, duration and fare.
- Interactive map integration.

### 2. Fare Comparison & Cab Booking
- Compare estimated fares across different vehicle categories.
- Fare breakdown including applicable taxes, platform fees and toll amounts.
- Vehicle selection across different categories.
- Booking confirmation and booking management.

### 3. User Experience & Personalisation
- Multi-page navigation and interactive interface.
- Pickup and destination swapping.
- Quick destination shortcuts.
- Saved places and profile management.
- Distance unit conversion between kilometres and miles.
- Responsive design for desktop and mobile devices.

### 4. Additional Functionality
- Customer feedback and review submission.
- User profile and settings management.
- Interactive trip tracking interface.
- Local JSON data handling and database integration.

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

1. **Frontend:** React handles the user interface, navigation and user interactions.
2. **Backend:** Node.js and Express.js handle API requests and application logic.
3. **Route Integration:** Mappls API provides route distance and duration information.
4. **Fare Calculation:** Vehicle-specific pricing rules are used to calculate estimated fares.
5. **Database:** MongoDB Atlas and Mongoose support booking data storage and retrieval.
6. **JSON Storage:** Additional application data, including saved places, feedback and profile information, is handled through JSON-based storage.

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend service health |
| GET | `/api/config` | Retrieve configuration status |
| GET | `/api/routes` | Retrieve available routes |
| GET | `/api/vehicles` | Retrieve vehicle categories |
| POST | `/api/estimate` | Calculate estimated fare |
| GET | `/api/bookings` | Retrieve bookings |
| POST | `/api/bookings` | Create a booking |
| DELETE | `/api/bookings/:id` | Delete a booking |
| GET | `/api/places` | Retrieve saved places |
| POST | `/api/places` | Add a saved place |
| GET | `/api/feedback` | Retrieve feedback |
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/profile` | Retrieve profile information |
| POST | `/api/profile` | Update profile information |
| GET | `/api/mongo/bookings` | Retrieve MongoDB bookings |
| POST | `/api/mongo/sync` | Synchronise booking records |
| GET | `/api/mongo/status` | Check MongoDB connection status |

## ⚙️ Getting Started

Follow these steps to run WayWise locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- Git
- MongoDB Atlas account
- Mappls developer account and an appropriate API key

### 1. Clone the repository

```bash
git clone https://github.com/hanshika1706/RideWise.git
```

### 2. Navigate to the application directory

```bash
cd RideWise/waywise
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `waywise` directory, alongside `package.json`.

Add the required configuration:

```env
MONGODB_URI=your_mongodb_connection_string
VITE_MAPPLS_KEY=your_mappls_api_key
PORT=4000
```

Add other environment variables if required by your local configuration.

**Important:** Replace the placeholder values with your own credentials. Never commit actual API keys, database connection strings or other sensitive information to GitHub.

### 5. Run the application

```bash
npm run dev
```

This starts the Express backend and Vite frontend concurrently.

Open the application:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:4000

## 🌐 Live Deployment

WayWise is deployed and accessible online.

- **Live Application:** https://ride-wise-xi.vercel.app/
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** MongoDB Atlas

## 📁 Project Structure

```text
waywise/
├── server/
│   ├── index.js
│   ├── mongo.js
│   └── data/
│       ├── bookings.json
│       ├── feedback.json
│       ├── places.json
│       └── profile.json
│
├── src/
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   ├── styles.css
│   ├── aboutUs.css
│   └── cabBooking.css
│
├── package.json
├── vite.config.js
└── README.md
```

## 📚 Learning Outcomes

Working on WayWise provided practical experience in:

- Building a full-stack web application using React and Node.js.
- Developing REST APIs using Express.js.
- Integrating third-party APIs.
- Connecting applications to MongoDB Atlas using Mongoose.
- Handling frontend-backend communication.
- Implementing CRUD operations.
- Managing application data using JSON and MongoDB.
- Debugging and handling API errors.
- Deploying frontend and backend applications.
- Collaborating on a team-based development project.

## 👥 Team & Contributions

**Academic Context:** 3rd Semester – Web Development Course  
**Institution:** BML Munjal University  
**Project Type:** Group Project

The initial concept and problem identification behind WayWise were my own, inspired by everyday commuting challenges.

The project was subsequently planned, developed and implemented collaboratively. Each team member contributed to bringing the idea to life.

**Team Members:**
- Hanshika
- Suhani
- Arzoo
- Pari
- Prince

## 🚀 Future Scope

Potential improvements for WayWise include:

- Live vehicle availability and tracking.
- Integration with additional navigation services.
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