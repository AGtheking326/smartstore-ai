import { store } from "./store.js";

//1st) smart search vala feature on basis of  score 
export function smartSearch(products,query)
{
const words=query.toLowerCase().split(" "); //split text -> words me 
return products.map(product=>
{
    let score=0;
    words.forEach(word=>
    {
        if(product.name.toLowerCase().includes(word))
        {
            score+=3;
        }
        if(product.category?.toLowerCase().includes(word))
            score+=2;
        if(product.tags?.some(tag => tag.toLowerCase().includes(word))) score += 1;
    });
    return {...product,score};
})
.filter(p=>p.score>0)
.sort((a,b)=>b.score-a.score);//desc order me 
}

//return krega topmost 4 prod based on demand of it 
export function getTrending(products)
{
    //sort prod in desc of demand (score)
    //looks into store.demand obj me and returns top most 4 prod
    return [...products].sort((a,b)=>(store.demand?.[b.id] || 0)-(store.demand?.[a.id] || 0))
    .slice(0,6);
}

//check krega lst viewd prod 
//finds all similar category of prod 
//returns upto 4 similar items 
export function getRecommendations(products)
{
    if(!store.viewed || store.viewed.length===0)
        return [];
    const lastViewedId=store.viewed[store.viewed.length-1];
    const baseProduct=products.find(p=>p.id===lastViewedId);
    if(!baseProduct)
        return [];

    //we return 4 similar items in same categry
    return products.filter(p=>p.id!==baseProduct.id && p.category===baseProduct.category).slice(0,6);
}