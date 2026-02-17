import {store,saveCart} from "./store.js";


export function addToCart(product)
{
    const existing=store.cart.find(item=>item.id==product.id);
    
    // ye check rha ki prod already exists krta hai ya nhi 
    if(existing)
    {
        existing.quantity+=1;
    }
    else
    {
        store.cart.push({...product,quantity:1});
    }
    saveCart();
}

//update quantity 
//it finds prod by id ,inc or dec quan using delta ,if <=0 -> remove krdga from cart 
export function updateQuantity(id,delta)
{
    const item=store.cart.find(item=>item.id==id);
    if(!item)
        return;
    item.quantity+=delta;
    if(item.quantity<=0)
    {
        store.cart=store.cart.filter(p=>p.id!==id);
    }
    saveCart();
}

//total of cart nikalo 
export function getTotal()
{
    return store.cart.reduce((sum,item)=>
    {
        return sum+item.price*item.quantity;
    },0);
}