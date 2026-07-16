// foods-data.js
// Static menu data used by the frontend-only version of the site.
// In the full-stack version this same data lived in backend/data/foods.json
// and was served by GET /api/foods — here it's just a JS array.

const FOODS_DATA = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    description: "Classic pizza topped with fresh mozzarella, tomato sauce, and basil leaves.",
    veg: true
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 349,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    description: "Loaded with spicy pepperoni and gooey melted cheese on a crispy crust.",
    veg: false
  },
  {
    id: 3,
    name: "BBQ Chicken Pizza",
    category: "Pizza",
    price: 399,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=500",
    description: "Smoky BBQ sauce, grilled chicken, red onions, and mozzarella cheese.",
    veg: false
  },
  {
    id: 4,
    name: "Classic Beef Burger",
    category: "Burger",
    price: 199,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    description: "Juicy beef patty with lettuce, tomato, cheese, and our secret sauce.",
    veg: false
  },
  {
    id: 5,
    name: "Crispy Chicken Burger",
    category: "Burger",
    price: 219,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
    description: "Crispy fried chicken breast with pickles and mayo in a soft bun.",
    veg: false
  },
  {
    id: 6,
    name: "Veggie Delight Burger",
    category: "Burger",
    price: 149,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500",
    description: "Grilled veggie patty with fresh greens and tangy sauce.",
    veg: true
  },
  {
    id: 7,
    name: "Chicken Biryani",
    category: "Biryani",
    price: 249,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500",
    description: "Fragrant basmati rice cooked with tender chicken and aromatic spices.",
    veg: false
  },
  {
    id: 8,
    name: "Mutton Biryani",
    category: "Biryani",
    price: 349,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500",
    description: "Slow-cooked mutton layered with spiced rice, a royal delicacy.",
    veg: false
  },
  {
    id: 9,
    name: "Veg Biryani",
    category: "Biryani",
    price: 199,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500",
    description: "Mixed vegetables and basmati rice cooked with traditional spices.",
    veg: true
  },
  {
    id: 10,
    name: "Coca-Cola",
    category: "Drinks",
    price: 49,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500",
    description: "Chilled classic soft drink, the perfect companion for your meal.",
    veg: true
  },
  {
    id: 11,
    name: "Fresh Orange Juice",
    category: "Drinks",
    price: 89,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500",
    description: "Freshly squeezed oranges, no added sugar, packed with vitamin C.",
    veg: true
  },
  {
    id: 12,
    name: "Mango Smoothie",
    category: "Drinks",
    price: 109,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500",
    description: "Creamy blend of ripe mangoes and yogurt, cool and refreshing.",
    veg: true
  },
 {
    id: 13,
    name: "Cold Coffee",
    category: "Drinks",
    price: 69,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A refreshing mix of coffee and milk blended with ice, offering a rich and satisfying flavor in every sip.",
    veg: true
  },
  {
    id: 14,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 149,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
    description: "Warm chocolate cake with a gooey molten center, served with ice cream.",
    veg: true
  },
  {
    id: 15,
    name: "New York Cheesecake",
    category: "Desserts",
    price: 179,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500",
    description: "Rich and creamy classic cheesecake with a buttery graham crust.",
    veg: true
  },
  {
    id:16,
    name: "Ras Malai",
    category: "Desserts",
    price:79,
    rating:4.6,
    image:"https://t3.ftcdn.net/jpg/18/64/12/92/360_F_1864129208_R5Q12lZq43d3jHeJKGwc6CV90gBECni4.jpg",
    description:"Ras malai(or rossomalai) is a classic, luxurious Indian dessert consisting of soft, spongy paneer (chhena) discs soaked in a rich, sweet, and thickened milk sauce known as *rabri*. It is traditionally flavored with cardamom and saffron, and garnished with slivered pistachios and almonds.",
    veg: true

  },
];
