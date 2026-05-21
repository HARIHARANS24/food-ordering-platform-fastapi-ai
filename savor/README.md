# SAVOR - Modern Food Ordering Platform

SAVOR is a cohesive, multi-page food ordering web application designed with a focus on modern aesthetics, seamless user experience, and a custom Python-powered AI Culinary Assistant.

## 🚀 Live Demo
**Production URL:** [https://savor-556236979279.us-central1.run.app](https://savor-556236979279.us-central1.run.app)

---

## 🛠 Technology Stack

### Frontend
- **HTML5/CSS3:** Vanilla implementation for structure and premium aesthetics.
- **JavaScript (ES6+):** Manages global cart state, API fetching, and UI interactivity.
- **LocalStorage:** Persists cart data across sessions.
- **Intersection Observer API:** Triggers scroll-based "Fade-in" animations.

### Backend
- **FastAPI (Python):** High-performance asynchronous API framework.
- **Pydantic:** Robust data validation for incoming requests.
- **Starlette StaticFiles:** Serves the frontend and assets as a monolithic application.
- **Uvicorn:** ASGI server for serving the application.

### Media & Design
- **AI-Generated Imagery:** Custom professional food photography generated specifically for the SAVOR menu.
- **Color Palette:** 
  - Tomato Red (`#FF6347`)
  - Fresh Basil Green (`#4CAF50`)
  - Charcoal (`#333333`)
  - Pure White (`#FFFFFF`)

---

## 📂 Directory Structure

```text
savor/
├── assets/             # Custom food photography and brand images
├── backend/
│   └── main.py         # FastAPI application and AI Assistant logic
├── frontend/
│   ├── index.html      # Main Menu & Home
│   ├── about.html      # Kitchen Story
│   ├── contact.html    # Support Form
│   ├── checkout.html   # Payment Simulation
│   ├── style.css       # Global premium styling
│   └── script.js       # Core frontend logic & API communication
├── Procfile            # Deployment instructions for Google Cloud Buildpacks
├── requirements.txt    # Python dependencies
└── README.md           # Project Documentation
```

---

## ✨ Key Features

### 1. Digital Menu
- Categorized view: Healthy Foods, Fast Foods, Mains, Beverages, Desserts, and Snacks.
- Dynamic rendering via the `/menu` API.

### 2. Global Cart System
- Persistent cart drawer accessible across all pages.
- Real-time updates and calculation of totals.
- Data persistence using `localStorage`.

### 3. AI Culinary Assistant
- A Python-powered "Virtual Waiter/Nutritionist".
- Keyword-based recommendation system (understands terms like "vegan", "spicy", "dessert", etc.).
- Friendly and appetizing tone of voice.

### 4. Secure Checkout Simulation
- Pydantic-validated payment processing.
- Realistic 2-second simulated processing delay.

### 5. Premium UX/UI
- Sticky navigation header.
- Responsive design for all screen sizes.
- Scroll-triggered fade-in animations for a high-end feel.

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/menu` | `GET` | Returns the full list of food items categorized. |
| `/chat` | `POST` | Receives user messages and returns AI Assistant responses. |
| `/process-payment` | `POST` | Simulates payment processing for the cart items. |
| `/contact-submit` | `POST` | Processes the contact form submission. |

---

## 💻 How to Run Locally

### Prerequisites
- Python 3.9+
- `pip`

### Setup
1. **Navigate to the project root:**
   ```bash
   cd savor
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Start the server:**
   ```bash
   uvicorn backend.main:app --reload
   ```
4. **Access the app:**
   Open `http://127.0.0.1:8000` in your web browser.

---

## ☁️ Deployment (Google Cloud Run)

The project is configured for one-click deployment using Google Cloud Buildpacks.

**Deployment Command:**
```bash
gcloud run deploy savor --source . --project [YOUR_PROJECT_ID] --region us-central1 --allow-unauthenticated
```

---

## 📜 Future Roadmap
- [ ] Integration with a real Payment Gateway (Stripe/PayPal).
- [ ] Real-time database integration (PostgreSQL/MongoDB) for dynamic menu management.
- [ ] User authentication and order history tracking.
- [ ] Advanced NLP for the AI Assistant using LLMs (e.g., Gemini API).
