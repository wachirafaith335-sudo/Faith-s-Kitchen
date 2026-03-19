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

function money(v) {
  return "KSh " + v.toLocaleString("en-KE");
}

function openModal(el) {
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
}

function closeModal(el) {
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
}

function setStatus(message) {
  statusMessage.textContent = message;
  statusMessage.classList.add("toast");
  statusMessage.classList.add("show");
  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    statusMessage.classList.remove("show");
  }, 2200);
}

function buildOrderMessage() {
  if (cart.length === 0) {
    return "Hello, I would like to place an order.";
  }
  const lines = cart.map((item) => item.name + " x " + item.qty);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  return "Hello, I would like to order:\n" + lines.join("\n") + "\nTotal: " + money(total);
}

function updateOrderLinks() {
  const wa = document.getElementById("order-whatsapp");
  const em = document.getElementById("order-email");
  if (!wa || !em) return;
  const msg = buildOrderMessage();
  wa.href = "https://wa.me/254726254749?text=" + encodeURIComponent(msg);
  em.href = "mailto:info@faithskitchen.com?subject=" + encodeURIComponent("Order Request") + "&body=" + encodeURIComponent(msg);
}

function addToCart(id, cardEl, qty) {
  const item = menuItems.find((m) => m.id === id);
  if (!item) return;
  const amount = Math.max(1, parseInt(qty || 1, 10));
  const inCart = cart.find((c) => c.id === id);
  if (inCart) inCart.qty += amount;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: amount });
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
    card.innerHTML =
      "<img loading=\"lazy\" decoding=\"async\" src=\"" + item.img + "\" alt=\"" + item.name + "\">" +
      "<h3>" + item.name + "</h3>" +
      "<p>" + money(item.price) + "</p>" +
      "<div class=\"qty-row\">" +
      "<button type=\"button\" class=\"qty-btn qty-minus\" aria-label=\"Decrease quantity\">-</button>" +
      "<span class=\"qty-value\" aria-live=\"polite\">1</span>" +
      "<button type=\"button\" class=\"qty-btn qty-plus\" aria-label=\"Increase quantity\">+</button>" +
      "<button type=\"button\" class=\"qty-add\">Add</button>" +
      "</div>";

    const qtyValue = card.querySelector(".qty-value");
    const minusBtn = card.querySelector(".qty-minus");
    const plusBtn = card.querySelector(".qty-plus");
    const addBtn = card.querySelector(".qty-add");

    let qty = 1;
    const setQty = (next) => {
      qty = Math.max(1, next);
      qtyValue.textContent = String(qty);
    };

    minusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setQty(qty - 1);
    });
    plusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setQty(qty + 1);
    });
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(item.id, card, qty);
    });

    card.addEventListener("click", () => addToCart(item.id, card, 1));
    menuContainer.appendChild(card);
  });
}

function drawCart() {
  let count = 0;
  let total = 0;
  cartItems.innerHTML = "";

  cart.forEach((item) => {
    count += item.qty;
    total += item.qty * item.price;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML =
      "<div class=\"cart-item-main\">" +
      "<span class=\"cart-item-name\">" + item.name + "</span>" +
      "<span class=\"cart-item-sub\">" + money(item.price) + " each</span>" +
      "</div>" +
      "<div class=\"cart-item-controls\">" +
      "<button type=\"button\" class=\"cart-btn cart-minus\" aria-label=\"Decrease quantity\">-</button>" +
      "<span class=\"cart-qty\">" + item.qty + "</span>" +
      "<button type=\"button\" class=\"cart-btn cart-plus\" aria-label=\"Increase quantity\">+</button>" +
      "<button type=\"button\" class=\"cart-remove\">Remove</button>" +
      "</div>";

    li.querySelector(".cart-minus").addEventListener("click", () => {
      item.qty = Math.max(1, item.qty - 1);
      drawCart();
    });
    li.querySelector(".cart-plus").addEventListener("click", () => {
      item.qty += 1;
      drawCart();
    });
    li.querySelector(".cart-remove").addEventListener("click", () => {
      const idx = cart.findIndex((c) => c.id === item.id);
      if (idx >= 0) cart.splice(idx, 1);
      drawCart();
    });

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
  updateOrderLinks();
}

document.getElementById("cart-link").addEventListener("click", () => openModal(cartModal));
document.getElementById("close-cart").addEventListener("click", () => closeModal(cartModal));
checkoutBtn.addEventListener("click", () => {
  cart.length = 0;
  drawCart();
  setStatus("Thank you. Your order is being prepared.");
  closeModal(cartModal);
});

document.getElementById("year").textContent = String(new Date().getFullYear());
renderMenu();
drawCart();

