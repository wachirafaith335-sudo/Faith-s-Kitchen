const menuItems = [
  { id: "grilled-chicken", name: "Grilled Chicken", price: 800, img: "grilled chicken.jpg" },
  { id: "beef-burger", name: "Beef Burger", price: 500, img: "beef burger.jpg" },
  { id: "fried-rice", name: "Fried Rice", price: 400, img: "fried rice.jpg" },
  { id: "vegetable-stir-fry", name: "Vegetable Stir Fry", price: 350, img: "Vegetable-Stir-Fry-2-1.jpg" },
  { id: "pasta-alfredo", name: "Pasta Alfredo", price: 600, img: "pasts.webp" },
  { id: "fish-tacos", name: "Fish Tacos", price: 700, img: "tacos.jpg" }
];

const menuContainer = document.getElementById("menu-container");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-modal-items");
const cartTotal = document.getElementById("cart-total");
const cartModal = document.getElementById("cart-modal");
const checkoutBtn = document.getElementById("checkout");
const statusMessage = document.getElementById("status-message");
const cart = [];
let statusTimer = null;

function money(v) { return "KSh " + v.toLocaleString("en-KE"); }
function openModal(el) { el.classList.add("is-open"); el.setAttribute("aria-hidden", "false"); }
function closeModal(el) { el.classList.remove("is-open"); el.setAttribute("aria-hidden", "true"); }
function setStatus(message) {
  statusMessage.textContent = message;
  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusMessage.textContent = ""; }, 4000);
}

function renderMenu() {
  menuItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.dataset.id = item.id;
    card.style.cursor = "pointer";
    card.innerHTML = "<img src=\"" + item.img + "\" alt=\"" + item.name + "\"><h3>" + item.name + "</h3><p>" + money(item.price) + "</p>";
    card.addEventListener("click", () => addToCart(item.id));
    menuContainer.appendChild(card);
  });
}

function addToCart(id) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return;
  const inCart = cart.find((c) => c.id === id);
  if (inCart) inCart.qty += 1;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  drawCart();
  setStatus(item.name + " added to cart.");
}

function drawCart() {
  let count = 0;
  let total = 0;
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    count += item.qty;
    total += item.qty * item.price;
    const li = document.createElement("li");
    li.textContent = item.name + " x " + item.qty + " - " + money(item.qty * item.price);
    cartItems.appendChild(li);
  });
  if (count === 0) {
    const li = document.createElement("li");
    li.textContent = "Your cart is empty. Add meals from the menu.";
    cartItems.appendChild(li);
  }
  cartCount.textContent = String(count);
  cartTotal.textContent = "Total: " + money(total);
  checkoutBtn.disabled = count === 0;
}

document.getElementById("cart-link").addEventListener("click", () => openModal(cartModal));
document.getElementById("close-cart").addEventListener("click", () => closeModal(cartModal));
document.getElementById("checkout").addEventListener("click", () => {
  cart.length = 0;
  drawCart();
  setStatus("Thank you. Your order is being prepared.");
  closeModal(cartModal);
});

document.getElementById("year").textContent = String(new Date().getFullYear());
renderMenu();
drawCart();

// UX overrides: toast + add animation
function setStatus(message) {
    statusMessage.textContent = message;
    statusMessage.classList.add("toast");
    statusMessage.classList.add("show");
    if (statusTimer) clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { statusMessage.classList.remove("show"); }, 2200);
}

function addToCart(id, cardEl) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return;
  const inCart = cart.find((c) => c.id === id);
  if (inCart) inCart.qty += 1;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  drawCart();
  setStatus(item.name + " added to cart.");
  if (cardEl) {
    cardEl.classList.add("is-adding");
    setTimeout(() => cardEl.classList.remove("is-adding"), 300);
  }
}
function renderMenu() {
  menuContainer.innerHTML = "";
  menuItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.dataset.id = item.id;
    card.style.cursor = "pointer";
    card.innerHTML = "<img src=\"" + item.img + "\" alt=\"" + item.name + "\"><h3>" + item.name + "</h3><p>" + money(item.price) + "</p>";
    card.addEventListener("click", () => addToCart(item.id, card));
    menuContainer.appendChild(card);
  });
}

renderMenu();
drawCart();


// Order link builder (WhatsApp + Email)
function buildOrderMessage() {
  if (cart.length === 0) {
    return "Hello, I would like to place an order.";
  }
  const lines = cart.map(item => item.name + " x " + item.qty);
  return "Hello, I would like to order:\n" + lines.join("\n") + "\nTotal: " + money(cart.reduce((s,i)=>s+i.qty*i.price,0));
}

function updateOrderLinks() {
  const wa = document.getElementById("order-whatsapp");
  const em = document.getElementById("order-email");
  if (!wa || !em) return;
  const msg = buildOrderMessage();
  wa.href = "https://wa.me/254726254749?text=" + encodeURIComponent(msg);
  em.href = "mailto:info@faithskitchen.com?subject=" + encodeURIComponent("Order Request") + "&body=" + encodeURIComponent(msg);
}

const _drawCart = drawCart;
drawCart = function () {
  _drawCart();
  updateOrderLinks();
};
updateOrderLinks();
