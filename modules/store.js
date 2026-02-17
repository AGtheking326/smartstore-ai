// sbse pehle we store centralized store object 
// It initializes the cart from localStorage.

// If saved cart data exists → it loads it.

// If not → it starts with an empty array.

// This ensures cart items remain even after page refresh.

export const store={
    cart:JSON.parse(localStorage.getItem("cart")) || [],
    viewed:JSON.parse(localStorage.getItem("viewed")) || [],
    demand:JSON.parse(localStorage.getItem("demand")) || {}
};


//convets cart to string 
export function saveCart(){
    localStorage.setItem("cart",JSON.stringify(store.cart));
}
export function saveDemand()
{
    localStorage.setItem("demand",JSON.stringify(store.demand));
}
export function saveViewed()
{
    localStorage.setItem("viewed",JSON.stringify(store.viewed));
}
//increaseDemand() updates product popularity count and saves it to browser storage.
export function increaseDemand(id, value = 1) {
  store.demand[id] = (store.demand[id] || 0) + value;
  saveDemand();
}