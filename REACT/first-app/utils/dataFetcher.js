async function getRestaturantList() {
    try {        
        const resp = await fetch('https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING');
        
        if(resp.ok && resp.status !== 404) {
            respData = await resp.json();   
            return respData.data.cards.filter(entry => entry.card.card?.gridElements?.infoWithStyle?.restaurants?.length > 0).map(entry => entry.card.card.gridElements.infoWithStyle.restaurants)[0];                        
        } else throw new Error(resp.statusText);        
        
    } catch(err) {
        console.warn(err);
        throw err;
    }
}

async function getRestaturantDetails({params}) {
    if(!params?.resId || !(/\d+/).test(params.resId)) throw new Error(`Invalid Restaurant Details Queried`);
    
    try {
        const response = await fetch(`https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=17.3716458&lng=78.49097669999999&restaurantId=${params.resId}&catalog_qa=undefined&submitAction=ENTER`);
        if(response.ok && response.status !== 404) {
            const respData = await response.json();
            return respData.data.cards;
        } else throw new Error(response.statusText);
    }catch(err) {
        console.warn(err)
        throw err;
    }
}


export {getRestaturantList, getRestaturantDetails};
