import { writable, get } from "svelte/store";


export const authUser = writable({
  firstName: '',
  lastName: '',
  email: '',
  birthday: '',
  phone: '',
  role: '',
  id: '',
})

export const cartItems = writable<Product[]>([]);

//add to cart
export const addToCart = (product: Product, selectedColor: Color) => {
  let items = get(cartItems);
  const storage = localStorage.getItem('busket_products');

  if (storage) {
    items = JSON.parse(storage)
  }

  cartItems.update(() => {
    return [ ...items, {...product, selectedColor}];
  })

  localStorage.setItem('busket_products', JSON.stringify(get(cartItems)));
}

//remove from cart
export const removeFromCart = (id: number) => {
  let items = get(cartItems);
  const storage = localStorage.getItem('busket_products');

  if (storage) {
    items = JSON.parse(storage)
  }

  cartItems.update(() => {
    const updatedItems = items.filter(item => {

      return item.id !== id;
    });

    return updatedItems;
  })

  localStorage.setItem('busket_products', JSON.stringify(get(cartItems)));
}
