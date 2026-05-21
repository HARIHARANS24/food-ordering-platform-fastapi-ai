from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import asyncio
import os

# Calculate paths relative to this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app = FastAPI(title="SAVOR API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CartItem(BaseModel):
    id: int
    name: str
    price: float
    quantity: int

class PaymentRequest(BaseModel):
    items: List[CartItem]
    total: float

class ChatRequest(BaseModel):
    message: str

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

MENU_ITEMS = [
    # ── Healthy Foods ──────────────────────────────────────────────
    {"id": 1,  "name": "Fresh Garden Salad",        "price": 9.99,  "category": "healthy foods", "imageURL": "/assets/salad.jpg"},
    {"id": 7,  "name": "Avocado Toast",             "price": 11.99, "category": "healthy foods", "imageURL": "/assets/avocado.jpg"},
    {"id": 9,  "name": "Quinoa Power Bowl",         "price": 13.99, "category": "healthy foods", "imageURL": "/assets/quinoa.jpg"},
    {"id": 10, "name": "Greek Yogurt Parfait",      "price": 7.99,  "category": "healthy foods", "imageURL": "/assets/parfait.jpg"},
    {"id": 11, "name": "Grilled Veggie Wrap",       "price": 10.99, "category": "healthy foods", "imageURL": "/assets/veggie_wrap.png"},
    {"id": 12, "name": "Kale & Berry Smoothie",     "price": 6.99,  "category": "healthy foods", "imageURL": "/assets/smoothie.png"},
    {"id": 13, "name": "Baked Salmon Fillet",       "price": 18.99, "category": "healthy foods", "imageURL": "/assets/salmon.jpg"},

    # ── Fast Foods ─────────────────────────────────────────────────
    {"id": 2,  "name": "Spicy Chicken Wings",       "price": 12.99, "category": "fast foods",    "imageURL": "/assets/wings.jpg"},
    {"id": 3,  "name": "Classic Cheeseburger",      "price": 14.99, "category": "fast foods",    "imageURL": "/assets/burger.jpg"},
    {"id": 14, "name": "Double Smash Burger",       "price": 16.99, "category": "fast foods",    "imageURL": "/assets/smash_burger.png"},
    {"id": 15, "name": "Fried Chicken Sandwich",    "price": 13.49, "category": "fast foods",    "imageURL": "/assets/chicken_sandwich.jpg"},
    {"id": 16, "name": "BBQ Bacon Burger",          "price": 15.99, "category": "fast foods",    "imageURL": "/assets/bbq_burger.png"},
    {"id": 17, "name": "Crispy Chicken Nuggets",    "price": 9.99,  "category": "fast foods",    "imageURL": "/assets/nuggets.png"},
    {"id": 18, "name": "Hot Dog with Jalapeños",    "price": 8.49,  "category": "fast foods",    "imageURL": "/assets/hotdog.png"},

    # ── Foods (Mains) ──────────────────────────────────────────────
    {"id": 4,  "name": "Margherita Pizza",          "price": 16.99, "category": "foods",         "imageURL": "/assets/pizza.jpg"},
    {"id": 19, "name": "Chicken Alfredo Pasta",     "price": 15.99, "category": "foods",         "imageURL": "/assets/pasta.jpg"},
    {"id": 20, "name": "Beef Tacos (3 pcs)",        "price": 12.99, "category": "foods",         "imageURL": "/assets/tacos.jpg"},
    {"id": 21, "name": "Lamb Kebab Platter",        "price": 19.99, "category": "foods",         "imageURL": "/assets/kebab.jpg"},
    {"id": 22, "name": "Mushroom Risotto",          "price": 14.49, "category": "foods",         "imageURL": "/assets/risotto.jpg"},
    {"id": 23, "name": "Paneer Butter Masala",      "price": 13.99, "category": "foods",         "imageURL": "/assets/paneer.jpg"},
    {"id": 24, "name": "Grilled T-Bone Steak",      "price": 24.99, "category": "foods",         "imageURL": "/assets/steak.jpg"},

    # ── Beverages ──────────────────────────────────────────────────
    {"id": 5,  "name": "Iced Lemon Tea",            "price": 4.99,  "category": "beverages",     "imageURL": "/assets/tea.jpg"},
    {"id": 25, "name": "Mango Lassi",               "price": 5.49,  "category": "beverages",     "imageURL": "/assets/lassi.jpg"},
    {"id": 26, "name": "Classic Cold Coffee",       "price": 5.99,  "category": "beverages",     "imageURL": "/assets/cold_coffee.jpg"},
    {"id": 27, "name": "Fresh Watermelon Juice",    "price": 4.49,  "category": "beverages",     "imageURL": "/assets/watermelon.jpg"},
    {"id": 28, "name": "Strawberry Milkshake",      "price": 6.49,  "category": "beverages",     "imageURL": "/assets/milkshake.jpg"},
    {"id": 29, "name": "Sparkling Mint Lemonade",   "price": 4.99,  "category": "beverages",     "imageURL": "/assets/lemonade.jpg"},
    {"id": 30, "name": "Hot Chocolate",             "price": 5.49,  "category": "beverages",     "imageURL": "/assets/hot_choco.jpg"},

    # ── Desserts ───────────────────────────────────────────────────
    {"id": 6,  "name": "Chocolate Lava Cake",       "price": 8.99,  "category": "desserts",      "imageURL": "/assets/cake.jpg"},
    {"id": 31, "name": "New York Cheesecake",       "price": 7.99,  "category": "desserts",      "imageURL": "/assets/cheesecake.jpg"},
    {"id": 32, "name": "Tiramisu",                  "price": 8.49,  "category": "desserts",      "imageURL": "/assets/tiramisu.jpg"},
    {"id": 33, "name": "Mango Sorbet",              "price": 6.49,  "category": "desserts",      "imageURL": "/assets/sorbet.jpg"},
    {"id": 34, "name": "Belgian Waffle",            "price": 9.49,  "category": "desserts",      "imageURL": "/assets/waffle.jpg"},
    {"id": 35, "name": "Gulab Jamun (4 pcs)",       "price": 5.99,  "category": "desserts",      "imageURL": "/assets/gulab_jamun.jpg"},
    {"id": 36, "name": "Crème Brûlée",             "price": 8.99,  "category": "desserts",      "imageURL": "/assets/creme_brulee.jpg"},

    # ── Snacks ─────────────────────────────────────────────────────
    {"id": 8,  "name": "Crispy Fries",              "price": 5.99,  "category": "snacks",        "imageURL": "/assets/fries.jpg"},
    {"id": 37, "name": "Loaded Nachos",             "price": 8.99,  "category": "snacks",        "imageURL": "/assets/nachos.jpg"},
    {"id": 38, "name": "Onion Rings",               "price": 6.49,  "category": "snacks",        "imageURL": "/assets/onion_rings.jpg"},
    {"id": 39, "name": "Cheese Garlic Bread",       "price": 5.49,  "category": "snacks",        "imageURL": "/assets/garlic_bread.jpg"},
    {"id": 40, "name": "Stuffed Jalapeño Poppers",  "price": 7.49,  "category": "snacks",        "imageURL": "/assets/jalapeno.jpg"},
    {"id": 41, "name": "Spring Rolls (6 pcs)",      "price": 7.99,  "category": "snacks",        "imageURL": "/assets/spring_rolls.jpg"},
    {"id": 42, "name": "Peri-Peri Corn on the Cob","price": 4.99,  "category": "snacks",        "imageURL": "/assets/corn.jpg"},
]

@app.get("/menu")
async def get_menu():
    return MENU_ITEMS

@app.post("/process-payment")
async def process_payment(payment_req: PaymentRequest):
    await asyncio.sleep(2)  # Simulated delay
    return {"status": "success", "message": "Payment Successful!"}

@app.post("/chat")
async def chat(chat_req: ChatRequest):
    msg = chat_req.message.lower()
    if any(keyword in msg for keyword in ["diet", "vegan", "healthy", "salad", "quinoa", "kale"]):
        return {"response": "Looking for something fresh and light? Try our Fresh Garden Salad, Quinoa Power Bowl, or Baked Salmon Fillet — all made with fresh, locally sourced ingredients!"}
    elif any(keyword in msg for keyword in ["spicy", "hot", "heat", "jalapeño", "peri"]):
        return {"response": "Craving a kick? Go for our Spicy Chicken Wings, Stuffed Jalapeño Poppers, or Peri-Peri Corn on the Cob — guaranteed to fire things up!"}
    elif any(keyword in msg for keyword in ["sweet", "dessert", "sugar", "cake", "waffle", "cheesecake"]):
        return {"response": "Indulge your sweet tooth! Our Chocolate Lava Cake, Belgian Waffle, and New York Cheesecake are absolute crowd-pleasers!"}
    elif any(keyword in msg for keyword in ["drink", "thirsty", "beverage", "tea", "juice", "smoothie", "coffee"]):
        return {"response": "Quench your thirst! Try our Iced Lemon Tea, Mango Lassi, Classic Cold Coffee, or Fresh Watermelon Juice — all super refreshing!"}
    elif any(keyword in msg for keyword in ["burger", "fast", "quick", "sandwich"]):
        return {"response": "In the mood for something hearty and fast? Our Double Smash Burger, BBQ Bacon Burger, and Fried Chicken Sandwich are fan favourites!"}
    elif any(keyword in msg for keyword in ["snack", "munch", "fries", "nachos", "bites"]):
        return {"response": "Need a snack fix? Our Loaded Nachos, Crispy Fries, Onion Rings, and Spring Rolls are perfect for munching!"}
    elif any(keyword in msg for keyword in ["pasta", "pizza", "steak", "main", "meal", "dinner"]):
        return {"response": "Looking for a proper meal? Try our Grilled T-Bone Steak, Chicken Alfredo Pasta, Mushroom Risotto, or Margherita Pizza!"}
    else:
        return {"response": "Hello! I'm your SAVOR Culinary Assistant. How can I help you today? I can recommend dishes if you're looking for something spicy, healthy, sweet, or a quick snack!"}

@app.post("/contact-submit")
async def contact_submit(form: ContactForm):
    return {"status": "success", "message": "Thank you for reaching out! We'll get back to you soon."}

# Mount static files at the end to avoid catching API routes
app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

# Since we want index.html at root, and about.html etc, we can use html=True
# However, sometimes html=True doesn't perfectly resolve subpages without an extension.
# But our frontend links to "about.html" directly, so it should work.
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")