/*
  PRIME VAULTX — website settings
  Add your WhatsApp number before accepting orders.
*/
const STORE_CONFIG = {
  whatsappNumber: "REPLACE_WITH_YOUR_WHATSAPP_NUMBER",
  contactEmail: "YOUR_EMAIL_HERE"
};

const searchInput = document.getElementById("searchInput");
const productCards = [...document.querySelectorAll(".product-card")];
const categoryButtons = [...document.querySelectorAll(".category")];
const productCount = document.getElementById("productCount");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");
const orderDialog = document.getElementById("orderDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogPrice = document.getElementById("dialogPrice");
const playerId = document.getElementById("playerId");

let selectedCategory = "all";
let selectedProduct = null;
let cartCount = 0;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => toast.classList.remove("show"), 2600
  );
}

function filterProducts() {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;

  productCards.forEach(card => {
    const categoryMatches =
      selectedCategory === "all" ||
      card.dataset.category === selectedCategory;

    const textMatches =
      card.dataset.name.toLowerCase().includes(term) ||
      card.textContent.toLowerCase().includes(term);

    const show = categoryMatches && textMatches;
    card.hidden = !show;
    if (show) visible++;
  });

  productCount.textContent =
    `${visible} product${visible === 1 ? "" : "s"}`;
  emptyState.hidden = visible !== 0;
}

searchInput.addEventListener("input", filterProducts);

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(item =>
      item.classList.remove("active")
    );
    button.classList.add("active");
    selectedCategory = button.dataset.category;
    filterProducts();
  });
});

document.querySelectorAll(".order-button").forEach(button => {
  button.addEventListener("click", () => {
    selectedProduct = {
      name: button.dataset.product,
      price: button.dataset.price
    };
    dialogTitle.textContent = selectedProduct.name;
    dialogPrice.textContent = selectedProduct.price;
    playerId.value = "";
    orderDialog.showModal();
  });
});

document.getElementById("dialogClose")
  .addEventListener("click", () => orderDialog.close());

orderDialog.addEventListener("click", event => {
  if (event.target === orderDialog) orderDialog.close();
});

document.getElementById("confirmOrder")
  .addEventListener("click", () => {
    if (!selectedProduct) return;

    const number = STORE_CONFIG.whatsappNumber.trim();

    if (!number || number.includes("REPLACE")) {
      showToast("Add your WhatsApp number in script.js first.");
      return;
    }

    const notes = playerId.value.trim();
    const message =
      `Hello Prime VaultX! I would like to ask about this product:\n` +
      `Product: ${selectedProduct.name}\n` +
      `Listed price: ${selectedProduct.price}` +
      `${notes ? `\nPlayer ID / notes: ${notes}` : ""}\n` +
      `Please confirm availability and final price.`;

    const url =
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
    cartCount++;

    document.getElementById("cartCount").textContent = cartCount;
    orderDialog.close();
  });

document.getElementById("cartButton")
  .addEventListener("click", () => {
    showToast(
      cartCount
        ? `${cartCount} order request(s) prepared in this session.`
        : "Choose a product and tap Order Now to start."
    );
  });

document.getElementById("menuToggle")
  .addEventListener("click", () => {
    const nav = document.getElementById("nav");
    const open = nav.classList.toggle("open");

    document.getElementById("menuToggle")
      .setAttribute("aria-expanded", String(open));
  });

document.querySelectorAll("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav").classList.remove("open");
    document.getElementById("menuToggle")
      .setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();

filterProducts();
