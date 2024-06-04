import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { extraInfoHTML, products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

// JS FILE FOR AMAZON.HTML

// data for products is coming from products.js

// combining each product html into one string
// productsHTML = productsHTML + next product string
let productsHTML = " ";

// looping through the array
// -> takes each obj from the Products list and saves it to Product and runs the function (generating html for each), etc repeats with every obj
// product.rating.stars * 10 => image src 40, 45 etc

// adding params to url
const url = new URL(window.location.href);
const search = url.searchParams.get("search");

let filteredProducts = products;

// If a search exists in the URL parameters -> filter the products that match the search.
if (search) {
  filteredProducts = products.filter((product) => {
    let matchingKeyword = false;

    product.keywords.forEach((keyword) => {
      //search by keywords and case-insensitive
      if (keyword.toLowerCase().includes(search.toLowerCase())) {
        matchingKeyword = true;
      }
    });

    return (
      matchingKeyword ||
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  });
}

filteredProducts.forEach((product) => {
  /* html part comments
  - data attribute added to button Add to cart to be able to know which product should be added to cart -> productId (should be unique)
  - select using product.id to identify for which product is the dropdown quantity
  - Added to cart using unique class to identify which product it is for
*/

  // to combine product's html codes together
  productsHTML =
    productsHTML +
    `
  <div class="product-container">
  <div class="product-image-container">
    <img
      class="product-image"
      src="${product.image}"
    />
  </div>

  <div class="product-name limit-text-to-2-lines">
  ${product.name}
  </div>

  <div class="product-rating-container">
    <img
      class="product-rating-stars"
      src="images/ratings/rating-${product.rating.stars * 10}.png" 
    />
    <div class="product-rating-count link-primary">${product.rating.count}</div>
  </div>

  <div class="product-price">€${formatCurrency(product.priceCents)}</div> 

  <div class="product-quantity-container">
    <select class="js-quantity-selector-${product.id}">
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
  </div>

  ${extraInfoHTML(product)}

  <div class="product-spacer"></div>

  <div class="added-to-cart js-added-to-cart-${product.id}">
    <img src="images/icons/checkmark.png" />
    Added
  </div>

  <button class="add-to-cart-button button-primary js-add-to-cart"
  data-product-id="${product.id}">Add to Cart</button>
</div>
`;
});

// search
document.querySelector(".js-search-button").addEventListener("click", () => {
  const search = document.querySelector(".js-search-bar").value;
  window.location.href = `amazon.html?search=${search}`;
});

// adding html to the page
document.querySelector(".js-products-grid").innerHTML = productsHTML;

function updateCartQuantity() {
  // counting cart quantity to show in the cart icon
  const cartQuantity = calculateCartQuantity();
  // getting cart quantity element and updating it
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

updateCartQuantity(); // calling to update cart items number

//using obj to save timeouts ids -> counting will start from beggining if clicked again before first timeout runs out
const addedMessageTimeouts = {};

function addedTimeout(productId) {
  // adding message Added
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);

  addedMessage.classList.add("added-to-cart-visible");

  //checking if there is prev timeout, if yes -> stop it
  const previousTimeoutId = addedMessageTimeouts[productId];
  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }
  // removing after 2s
  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove("added-to-cart-visible");
  }, 2000);

  // saving timeoutId for this product, so we can stop it later
  addedMessageTimeouts[productId] = timeoutId;
}

// getting all the Add to cart buttons
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  // looping through them
  button.addEventListener("click", () => {
    const productId = button.dataset.productId; // gets all data attributes -> product.id saves it to productId

    //running functions
    addToCart(productId); // located in cart.js
    updateCartQuantity();
    addedTimeout(productId);
  });
});
