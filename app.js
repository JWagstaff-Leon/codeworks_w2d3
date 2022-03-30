// #region data

const storefront = 
{
    flavors:
    {
        list: [{name: "vanilla scoop", price: "0.50"}, {name: "chocolate scoop", price: "0.65"}, {name: "mint scoop", price: "0.70"}, {name: "mint chocolate chip scoop", price: "0.85"}],
        selected: {},
        element: document.getElementById("flavors-list")
    },

    vessel:
    {
        list: [{name: "waffle cone", price: "0.10"}, {name: "dipped waffle cone", price: "0.20"}, {name: "sprinkled dipped waffle cone", price: "0.40"}, {name: "bowl", price: "0.00"}, {name: "hands", price: "-1.25"}],
        selected: -1,
        element: document.getElementById("vessel-list")
    },

    toppings:
    {
        list: [{name: "sprinkles", price: "0.05"}, {name: "whipped cream", price: "0.05"}, {name: "cherries", price: "0.50"}, {name: "hot fudge", price: "0.20"}],
        selected: [],
        element: document.getElementById("toppings-list")
    }
};
    
const cart = 
{
    contents: [],
    element: document.getElementById("cart"),
};

// #endregion
// #region storefront functions 

function clearSelected()
{
    storefront.flavors.selected = {};
    storefront.vessel.selected = -1;
    storefront.toppings.selected = [];

    drawStorefront();
}

function toggleSelected(category, selected)
{
    if(category === "vessel")
    {
        // if the vessel is selected, and the user selects the same one, deselect it;
        // otherwise, select the vessel the user selected
        if(storefront.vessel.selected >= 0 && storefront.vessel.selected === selected)
        {
            storefront.vessel.selected = -1;
        }
        else
        {
            storefront.vessel.selected = selected;
        }
    }
    else if(category === "flavors")
    {
        // add any flavor the user selects
        if(!storefront.flavors.selected[selected])
        {
            storefront.flavors.selected[selected] = 0;
        }
        storefront.flavors.selected[selected] += 1;
    }
    else if(category === "toppings")
    {
        // add any unselected topping the user selects;
        // remove any selected topping the user selects
        const isSelected = storefront.toppings.selected.findIndex(v => v === selected)
        if(isSelected >= 0)
        {
            storefront.toppings.selected.splice(isSelected, 1)
        }
        else
        {
            storefront.toppings.selected.push(selected);
        }
    }

    drawStorefront();
}


// #endregion
// #region Cart Functions 

function addSelectedToCart()
{
    if(!Object.keys(storefront.flavors.selected).length)
    {
        alert("Please choose at least 1 flavor");
        return;
    }
    if(storefront.vessel.selected < 0)
    {
        alert("Please choose a vessel");
        return;
    }
    // make a new item to add to cart to break reference
    const newCartItem = {flavors: {}, vessel: -1, toppings: []};
    
    // copy by value
    newCartItem.flavors = storefront.flavors.selected;
    newCartItem.vessel = storefront.vessel.selected;
    storefront.toppings.selected.forEach(topping => newCartItem.toppings.push(topping));

    cart.contents.push(newCartItem);
    clearSelected();

    drawCart();
}

function deleteCartItem(index)
{
    cart.contents.splice(index, 1);
    drawCart();
}

function clearCart()
{
    cart.contents = [];
    drawCart();
}

function getTotalPrice()
{
    let total = 0;
    cart.contents.forEach(item => total += getItemPrice(item));

    return total;
}

function getItemPrice(item)
{
    let total = 0;

    const flavorKeys = Object.keys(item.flavors); 
    const flavorValues = Object.values(item.flavors);

    for(let i = 0; i < flavorKeys.length; i++)
    {
        total += storefront.flavors.list[flavorKeys[i].toString()].price * flavorValues[i];
    }

    total += +storefront.vessel.list[item.vessel].price;

    item.toppings.forEach(topping => total += +storefront.toppings.list[topping].price);

    // turn it into tenthths of a cent, trunc it, turn it back into cents, round it, then turn it back into dollars
    return Math.round(Math.floor(total * 1000) / 10) / 100;
}

// #endregion
// #region draw functions 

function drawStorefront()
{
    drawFlavors();
    drawVessels();
    drawToppings();
}

function drawFlavors()
{
    let template = "";

    storefront.flavors.list.forEach((f, index) => template += 
    `<div class="col-3 m-2">
        <div class="card h-100" onclick="toggleSelected('flavors', ${index})">
            <div class="card-header ${storefront.flavors.selected[index] ? "" : "d-none"}">
                <h3>${storefront.flavors.selected[index]} Selected</h3>
            </div>
            <div class="card-body">
                <div class="card-title">${f.name}</div>
                <div class="card-subtitle">$${f.price}</div>
            </div>
        </div>
    </div>
    `);

    storefront.flavors.element.innerHTML = template;
}

function drawVessels()
{
    let template = "";

    storefront.vessel.list.forEach((v, index) => template += 
    `<div class="col-3 m-2">
        <div class="card h-100" onclick="toggleSelected('vessel', ${index})">
            <div class="card-header ${storefront.vessel.selected === index ? "" : "d-none"}">
                <h3>Selected</h3>
            </div>
            <div class="card-body">
                <div class="card-title">${v.name}</div>
                <div class="card-subtitle">$${v.price}</div>
            </div>
        </div>
    </div>
    `);

    storefront.vessel.element.innerHTML = template;
}

function drawToppings()
{
    let template = "";

    storefront.toppings.list.forEach((t, index) => template += 
    `<div class="col-3 m-2">
        <div class="card h-100" onclick="toggleSelected('toppings', ${index})">
            <div class="card-header ${storefront.toppings.selected.find(i => i === index) !== undefined ? "" : "d-none"}">
                <h3>Selected</h3>
            </div>
            <div class="card-body">
                <div class="card-title">${t.name}</div>
                <div class="card-subtitle">$${t.price}</div>
            </div>
        </div>
    </div>
    `);

    storefront.toppings.element.innerHTML = template;
}

function drawCart()
{
    let template = "";

    cart.contents.forEach((i, index) => template +=
    `
    <div class="my-2 p-2">
        <div class="d-flex">
            <div>
                <i class="mdi mdi-delete text-danger selectable" onclick= "deleteCartItem(${index})"></i>
                <h4 class="d-inline">Ice cream #${index + 1}</h4>
            </div>
            <h4 class="ms-auto">$${getItemPrice(i)}</h3>
        </div>
    </div>
    `);

    cart.element.innerHTML = template;

    document.getElementById("total").innerText = getTotalPrice();
}

function drawAll()
{
    drawStorefront();
    drawCart();
}

// #endregion

drawAll();