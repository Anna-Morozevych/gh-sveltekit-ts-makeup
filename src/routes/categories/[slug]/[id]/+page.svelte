<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import ComentForm from '$lib/components/ComentForm.svelte';
  import Comment from '$lib/components/Comment.svelte';
  import Product from '$lib/components/Product.svelte';
  import type { PageServerData } from './$types';
  import { onSnapshot, query, where } from "firebase/firestore";
  import { commentsRef } from '$lib/firebase/firebase';

  export let data: PageServerData;

  const product = data.product;
  let productComments: UserComment[] = [];

  const q = query(commentsRef, where('product.id', '==', product?.id));

  onSnapshot(q, (snapshot) => {
    let currentComments: UserComment[] = [];

    snapshot.docs.forEach((doc) => {
      const element = doc.data();

      currentComments.push({
        raiting: element?.raiting,
        userName: element?.userName,
        userId: element?.userId,
        date: element?.date,
        commentText: element?.commentText,
        product: element?.product,
        commentId: doc.id
      })

      currentComments.sort((date1, date2) => {
        return new Date(date2.date).getSeconds() - new Date(date1.date).getSeconds();
      });
      productComments = currentComments;
    })
  })

</script>

<section>
  <div class="container">
    <div class="bread-crumbs page-padding">
      <div class="bread-crumbs__body">
        <a href={base} class="bread-crumbs__link bread-crumbs__link--active">Home</a>
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 96 960 960" width="16" fill="#db5e95">
          <path d="m304 974-56-57 343-343-343-343 56-57 400 400-400 400Z"/>
        </svg>
        <a href="{base}/categories" class="bread-crumbs__link bread-crumbs__link--active">Categories</a>
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 96 960 960" width="16" fill="#db5e95">
          <path d="m304 974-56-57 343-343-343-343 56-57 400 400-400 400Z"/>
        </svg>
        <a href={`${base}/categories/${$page.params.slug}`} class="bread-crumbs__link bread-crumbs__link--active">{$page.params.slug}</a>
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 96 960 960" width="16" fill="#db5e95">
          <path d="m304 974-56-57 343-343-343-343 56-57 400 400-400 400Z"/>
        </svg>
        <div class="bread-crumb__div">
          {product?.name}
        </div>
      </div>
    </div>

    {#if product}
      <Product {product}/>
    {/if}

    <div class="comment page-padding">
      <div class="container">
        <div class="comment__body">
          <h2 class="comment__title">
            Your comments
          </h2>

          {#each productComments as comment}
            <Comment {comment} />
          {/each}

        </div>
      </div>
    </div>

    {#if product}
      <ComentForm {product}/>
    {/if}
  </div>
</section>

<style>
  .comment__body {
    padding: 40px 0;
  }

  .comment__title {
    font-size: 30px;
    font-weight: 700;
    color: rgb(180, 73, 180);
    margin-bottom: 30px;
  }

</style>