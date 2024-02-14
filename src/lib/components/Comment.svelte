<script lang="ts">
  import { doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
  import { db, replyCommentRef } from "$lib/firebase/firebase";
  import { beforeUpdate, onMount } from "svelte";
  import { page } from '$app/stores';
  import { base } from '$app/paths';
	import RepliedComment from "./RepliedComment.svelte";
  
  export let comment: UserComment;

  let raiting = 0;
  let userName = '';
  let authorId;
  let date = '';
  let url = '';
  url = $page.url.pathname;
  let isMyCommentPage: boolean;
  let product: Product;
  let commentId = '';


  beforeUpdate(() => {
    raiting = comment.raiting;
    authorId = comment.userId;
    date = comment.date;
    product = comment.product;
    commentId = comment.commentId;
    isMyCommentPage = (url.includes('my-comments'))
      ? true
      : false;

    if (authorId) {
      const docRef = doc(db, 'users', authorId);

      getDoc(docRef)
        .then((doc) => {
          const data = doc.data();
          userName = `${data?.firstName} ${data?.lastName}`;
        })
    } else {
      userName = 'Guest'
    }

    if (commentId) {
      const q = query(replyCommentRef, where('userCommentId', '==', commentId));
      let repliedComentsFromServer:RepliedComment[] = [];
    }

  })

</script>

<div class="comment-info">
  {#if !isMyCommentPage}
    <h3 class="comment-info__name">{userName}</h3>
  {/if}
  
  {#if isMyCommentPage}
    <a href="{base}/categories/{product.product_type}/{product.id}" class="comment__link">{product.name}</a>
  {/if}
  <span class="comment-info__date">{date}</span>

  <div class="stars" id="product-rate">
    {#if raiting >= 1}
      <i class="fa-solid fa-star" style="color: #ff9c1a;"/>
      {:else}
      <i class="fa-solid fa-star" />
    {/if}
    {#if raiting >= 2}
      <i class="fa-solid fa-star" style="color: #ff9c1a;"/>
      {:else}
      <i class="fa-solid fa-star" />
    {/if}
    {#if raiting >= 3}
      <i class="fa-solid fa-star" style="color: #ff9c1a;"/>
      {:else}
      <i class="fa-solid fa-star" />
    {/if}
    {#if raiting >= 4}
      <i class="fa-solid fa-star" style="color: #ff9c1a;"/>
      {:else}
      <i class="fa-solid fa-star" />
    {/if}
    {#if raiting >= 5}
      <i class="fa-solid fa-star" style="color: #ff9c1a;"/>
      {:else}
      <i class="fa-solid fa-star" />
    {/if}

  </div>

  <p class="comment-info__text">
    {comment.commentText}
  </p>

  <div class="comment__reply">
    <RepliedComment userCommentId={commentId}/>
  </div>
</div>



<style>
  .comment-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e6e6e6;
  }

  .comment-info__name {
    font-size: 22px;
    font-weight: 700;
  }

  .comment__link {
    font-size: 20px;
    font-weight: 700;
    color: #db5e95;
    text-decoration: underline;
  }

  .comment-info__date {
    font-size: 18px;
  }

  .comment-info__text {
    font-size: 16px;
  }

  .stars {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .stars i {
    color: #e6e6e6;
    font-size: 16px;
    cursor: pointer;
  }

  .comment__reply {
    padding: 0 0 0 30px;
    margin-top: 20px;
  }
</style>
