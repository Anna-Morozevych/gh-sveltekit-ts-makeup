<script lang="ts">
  import { replyCommentRef } from "$lib/firebase/firebase";
  import { addDoc } from "firebase/firestore";
	import { authUser } from "../../store/store";
  
  export let userCommentId: string;

  let replyCommentText = '';

  let user: User = {
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    phone: '',
    role: '',
    id: '',
  };

  authUser.subscribe(data => {
    user = {...data}
  })


  function postComment() {
    addDoc(replyCommentRef, {
      commentText: replyCommentText,
      date: new Date().toLocaleString(),
      authorRole: user.role,
      userCommentId: userCommentId,
    })
      .then(() => {
        console.log('Submit');
        clear();
      })
  }

  function clear() {
    replyCommentText = '';
  }
</script>


<h3 class="reply-title">
  Reply to the comment
</h3>

<form class="comment-form" on:submit|preventDefault={() => {postComment()}}>
  <textarea
    class="comment-form__input"
    name="comment"
    rows="3"
    bind:value={replyCommentText}
    required
  />

  <button class="btn comment-form__btn">POST</button>
</form>

<style>
  .comment-form {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    gap: 20px;
   }

  .comment-form__input {
    resize: none;
    width: 100%;
    border: 1px solid #e6e6e6;
    outline-color: rgba(180, 73, 180, 30%);
    border-radius: 8px;
    padding: 20px;
    font-size: 18px;
  }

  .comment-form__btn {
    width: 100%;
    max-width: 200px;
  }

  .reply-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
</style>