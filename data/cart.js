export let cart = JSON.parse(localStorage.getItem("cart")); //getting cart from localStorage, converting from string to obj

//if cart empty, will show default data
if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: 1,
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: 2,
    },
  ];
}

function saveToStorage() {
  //converting cart into string and saving to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

//finds matching product un the cart and updates its quantity to new quantity
export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
}

export function addToCart(productId) {
  let matchingItem; // if found matching item aka already in the cart -> saves to matchingItem

  cart.forEach((cartItem) => {
    // checking if product is already in the cart
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  // select section
  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  // getting value selected (1-10 but as a string), converting into a number by using Number
  const quantity = Number(quantitySelector);

  // if found matchingItem, then increases quantity by 1
  // if didnt find matching, then just adds the new product to the cart
  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1", //default
    }); // adding to the cart
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    //looking for productId of the product we want to remove, if not matched -> adds to cart
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart; //replacing current cart with new cart

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem; // if found matching item aka already in the cart -> saves to matchingItem

  cart.forEach((cartItem) => {
    // checking if product is already in the cart
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export function resetCart() {
  cart = [];
  saveToStorage();
}
