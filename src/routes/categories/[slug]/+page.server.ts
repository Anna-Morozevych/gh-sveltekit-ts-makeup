import type { PageServerLoad } from './$types';

export const load : PageServerLoad = async ({fetch, params}) => {
  const res = await fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?product_type=${params.slug.replace('-', '_')}`);
  const item : Product[] = await res.json();

  return {
    item
  };
}