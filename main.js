import { addToCart } from "./modules/cart.js";
import { store } from "./modules/store.js";
import { smartSearch,getRecommendations,getTrending } from "./modules/ai.js";
import { increaseDemand,saveViewed } from "./modules/store.js";

let products=[];

async function fetchProducts() {
    try{
        const response=await fetch("https://dummyjson.com/products?limit=108");
        const data=await response.json();

        products=data.products.map(item=>({
        id: item.id,
      name: item.title,
      category:item.category,
      price: Math.round(item.price * 90),
      image: item.thumbnail,
      tags:item.title.toLowerCase().split(" ")
        }));

        // we will built div for each prod showing uski image and name and price 
        renderAll();

    }
    catch(error)
    {
        console.error("Product Not Available",error);
    }
}

function updateCartCount()
{
    const count=store.cart.reduce((sum,item)=>
    {
        return sum+item.quantity;
    },0);
    document.getElementById("cartCount").textContent=count;
}
function renderProducts(products)
{
    const container=document.getElementById("productContainer");
    container.innerHTML="";
    //har prod ke liye ek div banega usme content ayega ab 
    products.forEach(product=>{
        const card=document.createElement("div");
        card.className="product-card";
        const img=document.createElement("img");
        img.src=product.image;
        img.alt=product.name;
        const title=document.createElement("h4");
        title.textContent=product.name;

         const price=document.createElement("h4");
        price.textContent=`₹${product.price}`;

        const button=document.createElement("button");
        button.textContent="Add to Cart";
        /* 
        When the card is clicked:
        //1)checks if product id is in store.viewed obj or not 
        //2)if new ->add its to store.viewed and calls saveViewed() to persist upd list
        3) inc prod demand by 1 using incDemand() 
        4)refreshes ui by calling renderTrending() && renderRecommendations()
        */
        card.addEventListener("click",()=>
        {
            if(!store.viewed.includes(product.id))
            {
                store.viewed.push(product.id);
                saveViewed();
            }
            increaseDemand(product.id,1);
            renderTrending();
            renderRecommendations();
        })

        //add to cart updation 
        button.addEventListener("click",(e)=>
        {
            e.stopPropagation();
            addToCart(product);
            increaseDemand(product.id,2);
            updateCartCount();
            renderTrending();
        });
        card.append(img,title,price,button);
        container.appendChild(card);
    });
}

//it dynamically creates and displays product cards for trending items.
function renderTrending()
{
    const container=document.getElementById("trendingContainer");
    if(!container)
        return;
    const trending=getTrending(products);
    container.innerHTML="";
    trending.forEach(product=>
    {
        const div=document.createElement("div");
        div.className="product-card";
        const img=document.createElement("img");
        img.src=product.image;
        img.alt=product.name;

        const name=document.createElement("p");
        name.textContent=product.name;
        div.append(img,name);
        container.appendChild(div);
    }
    );
}

function renderRecommendations()
{
    const container=document.getElementById("recommendContainer");
    if(!container)
        return;
    const recommendations=getRecommendations(products);
    container.innerHTML="";
    recommendations.forEach(product=>
    {
        const div=document.createElement("div");
        div.className="product-card";
        const img=document.createElement("img");
        img.src=product.image;
        img.alt=product.name;

        const name=document.createElement("p");
        name.textContent=product.name;
        div.append(img,name);
        container.appendChild(div);
    });
}
//adding a live search feature to input event
document.getElementById("searchInput")?.addEventListener("input",(e)=>
{
    const query=e.target.value.trim();
    const recommendSection = document.getElementById("recommendContainer")?.closest("section");
    const trendingSection = document.getElementById("trendingContainer")?.closest("section");
    //if empty search-> shows all products using renderproduct()
    if(!query)
    {
         recommendSection?.classList.remove("hidden");
        trendingSection?.classList.remove("hidden");

        renderProducts(products);
    }
    else
    {
        //if exists then filters using smartsearch 
        recommendSection?.classList.add("hidden");
        trendingSection?.classList.add("hidden");
        const results=smartSearch(products,query);
        renderProducts(results);
    }
});

function renderAll()
{
    renderProducts(products);
    renderTrending();
    renderRecommendations();
    updateCartCount();
}


const themeToggle=document.getElementById("themeToggle");
if(localStorage.getItem("theme")==="dark")
{
    document.body.classList.add("dark");
    if(themeToggle)
        themeToggle.textContent="☀️";
}
    if(themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}




fetchProducts();



