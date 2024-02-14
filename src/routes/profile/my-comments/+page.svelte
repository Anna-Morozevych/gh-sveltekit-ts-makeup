<script lang="ts">
  import { getDocs, query, where } from "firebase/firestore";
  import { onMount } from "svelte";
  import { commentsRef } from "$lib/firebase/firebase";
	import Comment from "$lib/components/Comment.svelte";
	import RepliedComment from "$lib/components/RepliedComment.svelte";
	import ReplyCommentForm from "$lib/components/ReplyCommentForm.svelte";

let authorId = '';
let allUserComents: UserComment[] = [];

onMount(() => {
  let storageId = localStorage.getItem('uid');
  
  if (storageId) {
    authorId = storageId;
  }

  const q = query(commentsRef, where('userId', '==', authorId));

  getDocs(q)
    .then(res => {
      res.docs.forEach((doc) => {
        const element = doc.data();
        allUserComents.push({
          raiting: element?.raiting,
          userName: element?.userName,
          userId: element?.userId,
          date: element?.date,
          commentText: element?.commentText,
          product: element?.product,
          commentId: doc.id
        })
        console.log(allUserComents);
        
      })

      allUserComents = allUserComents.sort((prod1, prod2) => prod1.date.localeCompare(prod2.date));
    })
})

$:console.log(allUserComents);
</script>

{#if allUserComents.length}
  {#each allUserComents as comment}
    <Comment {comment} />
  {/each}

{:else}
  <h2 class="leave-comment">
    You have not left any comments yet
  </h2>
{/if}

<style>
.leave-comment {
  font-size: 24px;
  color: rgb(180, 73, 180);
  text-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  margin-bottom: 40px;
}

.comment__reply{
    padding: 0 0 0 30px;
  }
</style>
