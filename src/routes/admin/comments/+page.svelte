<script lang="ts">
	import { base } from "$app/paths";
	import ReplyCommentForm from "$lib/components/ReplyCommentForm.svelte";
	import Comment from "$lib/components/Comment.svelte";
	import { commentsRef } from "$lib/firebase/firebase";
	import { onSnapshot, query, where } from "firebase/firestore";
	import { beforeUpdate, onMount } from "svelte";

  let comments: UserComment[] = [];
  let activeProductId = 0;
  let sortedProductComents: SortedComent[] = [];


    onSnapshot(commentsRef, (snapshot) => {
      let commentsFormServer: UserComment[] = [];
      let prepearProducts: SortedComent[] = [];

      snapshot.docs.forEach((doc) => {
        const element = doc.data();
        let currentId = commentsFormServer.findIndex(el => el.product.id === element?.product.id);

        commentsFormServer.push({
          raiting: element?.raiting,
          userName: element?.userName,
          userId: element?.userId,
          date: element?.date,
          commentText: element?.commentText,
          product: element?.product,
          commentId: doc.id
        });

        const commentData: SortedComentInfo = {
          raiting: element?.raiting,
          userId: element?.userId,
          date: element?.date,
          commentText: element?.commentText,
          commentId: doc.id
        };

        if (currentId < 0) {
          prepearProducts.push({
            productId: element?.product.id,
            product: element?.product,
            comments: [commentData]
          })
        } else {
          prepearProducts[currentId].comments.push(commentData)
        }
      });

      sortedProductComents = [...prepearProducts]
    })





  function setActiveComment(id:number) {
    activeProductId = id;

    const q = query(commentsRef, where('product.id', '==', id));

    onSnapshot(q, (snapshot) => {
      let commentsFromServer:UserComment[] = [];

      snapshot.docs.forEach((doc) => {
        const element = doc.data();

        commentsFromServer.push({
          raiting: element.raiting,
          userName: element.userName,
          userId: element.userId,
          date: element.date,
          commentText: element.commentText,
          product: element.product,
          commentId: doc.id
        })
      })

      comments = [...commentsFromServer];
    })
  }

  
</script>

<div class="tabs">
  <div class="tab-links">
    {#each sortedProductComents as product}
      <a
        href="{base}/"
        class="tab {product.product.id === activeProductId? 'tab--active' : ''}"
        on:click|preventDefault={() => {setActiveComment(product.product.id)}}
      >
        {product.product.name}
      </a>
    {/each}
  </div>

  <div class="tab-content">
    {#if comments.length > 0}
      {#each comments as comment}
          <Comment comment={comment}/>
          <div class="comment">
            <div class="comment__reply-form">
              <ReplyCommentForm userCommentId={comment.commentId}/>
            </div>
          </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .tabs {
    display: flex;
  }

  .tab {
    padding: 10px;
    display: block;
    font-size: 16px;
    font-weight: bold;
    margin-right: 20px;
    border-right: 1px solid #e1e1e1;
    max-width: 200px;
  }

  .tab:hover {
    background-color: rgba(219, 94, 148, 0.2);
  }

  .tab--active {
    background-color: rgba(219, 94, 148, 0.2);
  }

  .tab-content {
    width: 100%;
  }

  .comment {
    margin: 0 0 40px;
  }

  .comment__reply-form{
    padding: 0 0 0 30px;
  }
</style>
