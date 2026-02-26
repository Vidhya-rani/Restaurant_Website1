// ============================
// GLOBAL CART
// ============================

let cart = [];

// Load from storage
function loadCart() {
    const saved = JSON.parse(localStorage.getItem("cart"));
    cart = saved ? saved : [];
}

// Save to storage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ============================
// DOM READY
// ============================

window.addEventListener("DOMContentLoaded", function () {

    loadCart();
    updateCartCount();

    const cartIcon = document.getElementById("cartIcon");
    const cartPanel = document.getElementById("cartPanel");
    const toggleBtn = document.getElementById("themeToggle");
    const clearBtn = document.getElementById("clearCartBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");

    // =========================
    // DARK MODE
    // =========================

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    toggleBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode") ? "dark" : "light"
        );
    });

    // =========================
    // OPEN CART
    // =========================

    cartIcon.addEventListener("click", function () {
        cartPanel.classList.toggle("show-cart");
        renderCart();
    });

    // =========================
    // ADD TO CART
    // =========================

    document.querySelectorAll(".add-to-cart").forEach(button => {

        button.addEventListener("click", function () {

            loadCart(); // always reload fresh cart

            const item = this.closest(".menu-item");

            const name = item.querySelector("p").innerText.trim();
            const priceText = item.querySelector(".item-price").innerText.trim();
            const price = Number(priceText.replace(/[^\d]/g, ""));

            if (isNaN(price) || price <= 0) return;

            const existing = cart.find(p => p.name === name);

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            saveCart();
            updateCartCount();
        });

    });

    // =========================
    // CLEAR CART
    // =========================

    clearBtn.addEventListener("click", function () {
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
    });

    // =========================
    // CHECKOUT
    // =========================

    checkoutBtn.addEventListener("click", function () {

        loadCart(); // always reload latest cart

        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        const total = calculateTotal();

        const container = document.getElementById("cartItems");
        container.innerHTML = `<h2>Order Placed! Total: ₹${total}</h2>`;

        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
            cartPanel.classList.remove("show-cart");
        }, 2000);
    });

});


// =========================
// UPDATE CART COUNT
// =========================

function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    const totalItems = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    cartCount.textContent = totalItems;
}


// =========================
// CALCULATE TOTAL
// =========================

function calculateTotal() {
    return cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);
}


// =========================
// RENDER CART
// =========================

function renderCart() {

    const container = document.getElementById("cartItems");
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty</p>";
        return;
    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item">
                <p><strong>${item.name}</strong></p>
                <p>₹${item.price}</p>

                <div>
                    <button onclick="decreaseQuantity('${item.name}')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.name}')">+</button>
                </div>

                <button onclick="removeItem('${item.name}')">❌</button>
            </div>
            <hr>
        `;
    });

    container.innerHTML += `<h3>Total: ₹${total}</h3>`;
}


// =========================
// QUANTITY FUNCTIONS
// =========================

function increaseQuantity(name) {

    loadCart();

    const product = cart.find(item => item.name === name);
    if (product) product.quantity += 1;

    saveCart();
    updateCartCount();
    renderCart();
}

function decreaseQuantity(name) {

    loadCart();

    const product = cart.find(item => item.name === name);

    if (product) {
        product.quantity -= 1;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.name !== name);
        }
    }

    saveCart();
    updateCartCount();
    renderCart();
}

function removeItem(name) {

    loadCart();

    cart = cart.filter(item => item.name !== name);

    saveCart();
    updateCartCount();
    renderCart();
}
