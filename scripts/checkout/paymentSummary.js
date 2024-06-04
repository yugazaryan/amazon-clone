import { cart, resetCart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;

  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.01;
  const totalCents = totalBeforeTaxCents + taxCents;

  // fixing number of items in payment summary
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  //html

  const paymentSummaryHTML = `
          <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div >Items (${cartQuantity}):</div>
            <div class="payment-summary-money">€${formatCurrency(
              productPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">€${formatCurrency(
              shippingPriceCents
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">€${formatCurrency(
              totalBeforeTaxCents
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">€${formatCurrency(
              taxCents
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">€${formatCurrency(
              totalCents
            )}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
  `;

  //updating html for payment summary
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  // making Place order btn interactive

  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      //sending request to the backend
      //await makes it wait for the response
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        // gives more info about our request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });
      // gives data attached to the response => order
      const order = await response.json();

      //adding order to order array
      addOrder(order);

      // making cart empty after creating order

      resetCart();

      // opening orders page
      window.location.href = "orders.html";
    });
}
