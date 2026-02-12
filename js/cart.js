
//1//
function addToCart(cart, product) {
  const found = cart.find(item => item.id === product.id);

  if (found) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, qty: item.qty + 1 }
        : item
    );
  } else {
    return [...cart, { ...product, qty: 1 }];
  }
}

//2//
function removeFromCart(cart, id) {
  const found = cart.find(item => item.id === id);

  if (!found) {
    return cart;
  }

  if (found.qty > 1) {
    return cart.map(item =>
      item.id === id
        ? { ...item, qty: item.qty - 1 }
        : item
    );
  } else {
    return cart.filter(item => item.id !== id);
  }
}

//3//

function calculateTotal(cart) {
  return cart.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);
}

//4//


