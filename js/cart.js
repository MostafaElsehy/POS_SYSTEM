export function addToCartLogic(cart, product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    // create a new array with updated quantity to avoid unexpected mutations
    return cart.map((item) =>
      item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
    );
  }
  return [...cart, { ...product, qty: 1 }];
}

export function removeFromCartLogic(cart, id) {
  const existing = cart.find((item) => item.id === id);
  if (!existing) {
    // item not in cart; return cart unchanged
    return cart;
  }
  if (existing.qty > 1) {
    return cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty - 1 } : item,
    );
  }
  return cart.filter((item) => item.id !== id);
}

export function calculateTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.qty, 0);
}
