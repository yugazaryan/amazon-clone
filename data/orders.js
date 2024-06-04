export const orders = JSON.parse(localStorage.getItem("orders")) || []; //empty is default

// function to add order to the array Orders

export function addOrder(order) {
  orders.unshift(order); // adds to the front of the array instead of at the end
  saveToStorage();
}

// saving to local storage
function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

//getting order and saving it into matchingOrder
export function getOrder(orderId) {
  let matchingOrder;

  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });
  return matchingOrder;
}
