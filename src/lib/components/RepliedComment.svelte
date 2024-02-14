<script lang="ts">
	import { replyCommentRef } from "$lib/firebase/firebase";
	import { getDocs, onSnapshot, query, where } from "firebase/firestore";
  import { afterUpdate, beforeUpdate, onMount } from "svelte";

  export let userCommentId: string;


  let repliedComents: RepliedComment[] = [];
  // let comentsToRender: RepliedComment[] = [];

  // const q = query(replyCommentRef, where('userCommentId', '==', userCommentId));
  
  

  async function fetchData() {
    const q = query(replyCommentRef, where('userCommentId', '==', userCommentId));
    const querySnapshot = await getDocs(q);
    const res:RepliedComment[] = [];

    querySnapshot.forEach((doc) => {
      const element = doc.data();
      res.push({
        commentText: element.commentText,
        date: element.date,
        userCommentId: element.userCommentId,
        authorRole: element.authorRole,
        id: element.id
      })
    })


    return res;
  }

  let promise = fetchData();


  afterUpdate(() => {
    promise = fetchData()
  })


  let q = query(replyCommentRef, where('userCommentId', '==', userCommentId));

  // let currentCommentId = '';
  // beforeUpdate(() => {
  //   currentCommentId = userCommentId;
  //   console.log(currentCommentId);

  // })


    // onSnapshot(q, (snapshot) => {
    //   let commentsFromServer: RepliedComment[] = [];

    //   snapshot.docs.forEach((doc) => {
    //     const element = doc.data();

    //     commentsFromServer.push({
    //       commentText: element.commentText,
    //       date: element.date,
    //       userCommentId: element.userCommentId,
    //       authorRole: element.authorRole,
    //       id: element.id
    //     })
        
    //   })


    //   //comentsToRender = [...commentsFromServer];
    //   // repliedComents = [...commentsFromServer];
    // })



</script>


{#each repliedComents as comment}
  <div class="comment-info">
    <h3
      class="comment-info__name {comment.authorRole === 'admin' ? 'comment-info__name--admin' : 'comment-info__name--manager'}"
    >
        {comment.authorRole}
    </h3>
    <span class="comment-info__date">{comment.date}</span>

    <p class="comment-info__text">
      {comment.commentText}
    </p>
  </div>
{/each}


{#await promise}
  <p>Fetching...</p>
  {:then data}
  {#each data as comment}
  <div class="comment-info">
    <h3
      class="comment-info__name {comment.authorRole === 'admin' ? 'comment-info__name--admin' : 'comment-info__name--manager'}"
    >
        {comment.authorRole}
    </h3>
    <span class="comment-info__date">{comment.date}</span>

    <p class="comment-info__text">
      {comment.commentText}
    </p>
  </div>
  {/each}
  <!-- <div>{data}</div> -->
{/await}

<style>
  .comment-info {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .comment-info__name {
    font-size: 14px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 8px;
    text-transform: uppercase;
  }

  .comment-info__name--admin {
    color: green;
    background-color: rgba(144, 238, 144, 0.5);
  }

  .comment-info__name--manager {
    color: blue;
    background-color: rgba(173, 216, 230, 0.5);
  }

  .comment-info__date {
    font-size: 18px;
  }

  .comment-info__text {
    font-size: 16px;
  }
</style>
