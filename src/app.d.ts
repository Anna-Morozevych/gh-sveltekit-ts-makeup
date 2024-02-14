// See https://kit.svelte.dev/docs/types#app

// import type { Timestamp } from "firebase/firestore"

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

  interface Category {
    name: string,
    slug: string
  }

  interface Product {
    api_featured_image: string,
    brand: string,
    category: null | string,
    created_at: string,
    currency: string,
    description: string,
    id: number,
    image_link: string,
    name: string,
    price: string,
    price_sign: string,
    product_api_url: string
    product_colors: Color[],
    product_link: string,
    product_type: string,
    raiting: null | number,
    tag_list: string[],
    updated_at: string,
    website_link: string,
    selectedColor: Color | null
  }

  interface Color {
    hex_value: string,
    colour_name: string
  }

  interface User {
    firstName: string,
    lastName: string,
    email: string,
    birthday: string,
    phone: string,
    role: string,
    id: string
  }

  interface IsChange {
    firstName: boolean,
    lastName: boolean,
    email: boolean,
    birthday: boolean,
    phone: boolean,
  }

  interface UserComment {
    raiting: number,
    userName: string,
    userId: string | null,
    date: string,
    commentText: string,
    product: Product,
    commentId: string
  }

  interface SortedComent {
    productId: number,
    product: Product,
    comments: SortedComentInfo[]
  }

  interface SortedComentInfo {
    raiting: number,
    userId: string,
    date: string,
    commentText: string,
    commentId: string
  }

  interface ImportMetaEnv {
    VITE_PUBLIC_STRIPE_KEY: string;
  }

  interface Order {
    date: string,
    orderId: string,
    orderInfo: Product[],
    total?: number,
    userId: string | null,
    status: string,
  }

  interface Date {
    seconds: number,
    nanoseconds: number
  }

  interface Status {
    step: number,
    name: string,
    icon: string,
    color: string
  }

  interface RepliedComment {
    commentText: string,
    date: string,
    userCommentId: string,
    authorRole: string,
    id: string
  }
}





export {};

export type Brand = string;
