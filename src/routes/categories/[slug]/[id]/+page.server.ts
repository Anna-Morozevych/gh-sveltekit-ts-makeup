import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const res = await fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${params.slug.replace('-', '_')}`);
  const products: Product[] = await res.json();
  const product = products.find(el => el.id === +params.id);

  if (product) {
    return { 
      product,
     };
  }
}