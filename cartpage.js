import { store } from "./modules/store.js";
import { updateQuantity, getTotal } from "./modules/cart.js";
import { initTheme } from "./modules/theme.js";
initTheme();


const container=document.getElementById("cartContainer");
const total=document.getElementById("cartTotal");

function renderCart()
{
    container.innerHTML="";
    if(store.cart.length==0)
    {
        const emptyMsg=document.createElement("p");
        emptyMsg.textContent="Your cart is empty.";
        container.appendChild(emptyMsg);
        total.textContent="";
        return;
    }

    store.cart.forEach(item => {

    const div = document.createElement("div");
    div.className = "cart-item";

    // Product Image
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;

    // Info Container
    const info = document.createElement("div");
    info.className = "cart-info";

    const title = document.createElement("h4");
    title.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = `₹${item.price} × ${item.quantity}`;

    // Buttons container
    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const incBtn = document.createElement("button");
    incBtn.textContent = "+";
    incBtn.className = "inc";

    const decBtn = document.createElement("button");
    decBtn.textContent = "-";
    decBtn.className = "dec";

    incBtn.addEventListener("click", () => {
        updateQuantity(item.id, 1);
        renderCart();
    });

    decBtn.addEventListener("click", () => {
        updateQuantity(item.id, -1);
        renderCart();
    });

    controls.append(incBtn, decBtn);
    info.append(title, price, controls);

    div.append(img, info);
    container.appendChild(div);
});

    total.textContent="Your Total is: ₹"+getTotal();
}
renderCart();
