<script lang="ts">
  import { addDoc } from "firebase/firestore";
  import { commentsRef } from "$lib/firebase/firebase";
  import { base } from '$app/paths';

  export let product: Product;

  let raiting = 0;
  let commentText = '';

  function setRaiting(raitingNum: number) {
    raiting = raitingNum;
  }

  function postComment() {
    if (!raiting) {
      pushNotification();
      return
    }

    addDoc(commentsRef, {
      product,
      raiting,
      commentText,
      date: new Date().toLocaleString(),
      userId: localStorage.getItem('uid'),
    })
      .then(() => {
        console.log('Submit');
        clear();
      })
  }

  function clear() {
    raiting = 0;
    commentText = '';
  }

  function pushNotification() {
    const stars = document.querySelector('#stars');
    const notification = document.createElement('div');
    notification.className = 'raiting-error';
    notification.textContent = 'Rate this product';
    stars?.append(notification);

    setTimeout(() => {
      notification.remove()
    }, 3000);
  }

</script>

<div class="comment-block page-padding">
  <div class="container">
    <div class="comment-block__body">
      <h2 class="comment-block__title">
        Leave a comment
      </h2>

      <form class="comment-form" on:submit|preventDefault={postComment}>
        <div class="raiting-box">
          <div class="stars" id="stars">
            <a href={base} on:click|preventDefault={() => setRaiting(1)}>
              <i class="fa-solid fa-star" id="1" style="{raiting >= 1? 'color: #ff9c1a;' : '#e6e6e6'}"></i>
            </a>
            <a href={base} on:click|preventDefault={() => setRaiting(2)}>
              <i class="fa-solid fa-star" id="2" style="{raiting >= 2? 'color: #ff9c1a;' : '#e6e6e6'}"></i>
            </a>
            <a href={base} on:click|preventDefault={() => setRaiting(3)}>
              <i class="fa-solid fa-star" id="3" style="{raiting >= 3? 'color: #ff9c1a;' : '#e6e6e6'}"></i>
            </a>
            <a href={base} on:click|preventDefault={() => setRaiting(4)}>
              <i class="fa-solid fa-star" id="4" style="{raiting >= 4? 'color: #ff9c1a;' : '#e6e6e6'}"></i>
            </a>
            <a href={base} on:click|preventDefault={() => setRaiting(5)}>
              <i class="fa-solid fa-star" id="5" style="{raiting >= 5? 'color: #ff9c1a;' : '#e6e6e6'}"></i>
            </a>
          </div>
        </div>
        <textarea
          class="comment-form__input"
          name="comment"
          rows="10"
          bind:value={commentText}
          required
        />

        <button class="btn comment-form__btn">POST</button>
      </form>
    </div>
  </div>
</div>

<style>
  .comment-block__body {
    padding: 40px 0;
  }

  .comment-block__title {
    font-size: 30px;
    font-weight: 700;
    color: rgb(180, 73, 180);
    margin-bottom: 30px;
  }

   .comment-form {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    gap: 20px;
   }

  .raiting-box {
    position: relative;
  }

  .raiting-box .stars {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .stars i {
    color: #e6e6e6;
    font-size: 28px;
    cursor: pointer;
    transition: color 0.2s ease;
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


</style>
