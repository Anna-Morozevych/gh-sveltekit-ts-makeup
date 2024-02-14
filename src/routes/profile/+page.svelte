<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import { auth, db } from "$lib/firebase/firebase";
  import { authUser } from "../../store/store";
  import { doc, getDoc, updateDoc } from "firebase/firestore";

let user: User = {
  firstName: '',
  lastName: '',
  email: '',
	birthday: '',
  phone: '',
  role: '',
  id: ""
};


let userId = '';
let isChange: IsChange = {
  firstName: false,
  lastName: false,
  email: false,
  birthday: false,
  phone: false,
}

type isChangeKey = keyof IsChange;
type userKey = keyof User

let prevValue = '';


authUser.subscribe(data => {
  user = {...data}
})


onMount(() => {
  let uidFromStorage = window.localStorage.getItem('uid');

  uidFromStorage
    ? userId = uidFromStorage
    : '';
})

function reset() {
  isChange.firstName = false;
  isChange.lastName = false;
  isChange.email = false;
  isChange.birthday = false;
  isChange.phone = false;
}

function updateDataHandler(name: userKey) {
  const docRef = doc(db, 'users', userId);

  if(!user[name].length) {
    user[name] = prevValue;
    prevValue = '';
    reset();
    return;
  }

  updateDoc(docRef, {
    [name]: user[name]
  })
  .then(() => {
    reset();
  })
}

  function changeHandler(name: isChangeKey) {
    isChange[name] = true;
    prevValue = user[name];
    console.log(prevValue);
    
  }

  function cancelHandler(name: isChangeKey) {
    isChange[name] = false;
    prevValue = user[name];
  }


</script>

<div class="person-data">
  <div class="person-data__item">
    <p class="person-data__label">First name</p>
    {#if !isChange.firstName}
      <p class="person-data__info">{user.firstName}</p>
      <button type="button" name="firstName" class="btn-gray" on:click={() => changeHandler('firstName')}>
        change
      </button>
    {:else}
      <label>
        <input
          type="text"
          name="firstName"
          placeholder="Full Name"
          class="person-data__input"
          bind:value={user.firstName}>
      </label>
      <div class="btns-wrap">
        <button type="button" class="btn-gray mr" name="firstName" on:click={() => updateDataHandler('firstName')}>
          save
        </button>
        <button type="button" class="btn-gray" name="firstName" on:click={() => cancelHandler('firstName')}>
          cancel
        </button>
    </div>
    {/if}
  </div>

  <div class="person-data__item">
    <p class="person-data__label">Last name</p>
    {#if !isChange.lastName}
      <p class="person-data__info">{user.lastName}</p>
      <button type="button" class="btn-gray" name="lastName" on:click={() => changeHandler('lastName')}>
        change
      </button>
    {:else}
      <label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          class="person-data__input"
          bind:value={user.lastName}>
      </label>
      <div class="btns-wrap">
        <button type="button" class="btn-gray mr" name="lastName" on:click={() => updateDataHandler('lastName')}>
          save
        </button>
        <button type="button" class="btn-gray" name="lastName" on:click={() => cancelHandler('lastName')}>
          cancel
        </button>
    </div>
    {/if}
  </div>

  <div class="person-data__item">
    <p class="person-data__label">Email</p>
    {#if !isChange.email}
      <p class="person-data__info">{user.email}</p>
      <button type="button" class="btn-gray" name="email" on:click={() => changeHandler('email')}>
        change
      </button>
    {:else}
      <label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          class="person-data__input"
          bind:value={user.email}>
      </label>
      <div class="btns-wrap">
        <button type="button" class="btn-gray mr" name="email" on:click={() => updateDataHandler('email')}>
          save
        </button>
        <button type="button" class="btn-gray" name="email" on:click={() => cancelHandler('email')}>
          cancel
        </button>
    </div>
    {/if}
  </div>

  <div class="person-data__item">
    <p class="person-data__label">Birthday</p>
    {#if !isChange.birthday}
      {#if !user.birthday}
        <p class="person-data__info">When is your birthday?</p>
      {:else}
        <p class="person-data__info">{user.birthday}</p>
    {/if}
      <button type="button" class="btn-gray" name="birthday" on:click={() => changeHandler('birthday')}>
        change
      </button>
    {:else}
      <label>
        <input
          type="date"
          name="birthday"
          placeholder="Birthday"
          class="person-data__input"
          bind:value={user.birthday}>
      </label>
      <div class="btns-wrap">
        <button type="button" class="btn-gray mr" name="birthday" on:click={() => updateDataHandler('birthday')}>
          save
        </button>
        <button type="button" class="btn-gray" name="birthday" on:click={() => cancelHandler('birthday')}>
          cancel
        </button>
      </div>
    {/if}
  </div>

  <div class="person-data__item">
    <p class="person-data__label">Phone number</p>

    {#if !isChange.phone}
      {#if !user.phone}
        <p class="person-data__info">Please add a phone number</p>
      {:else}
        <p class="person-data__info">{user.phone}</p>
      {/if}
      <button type="button" class="btn-gray" name="phone" on:click={() => changeHandler('phone')}>
        change
      </button>
    {:else}
      <label>
        <input
          type="tel"
          name="phone"
          placeholder="+38(050) 111 11 11"
          class="person-data__input"
          bind:value={user.phone}>
      </label>
      <div class="btns-wrap">
        <button type="button" class="btn-gray mr" name="phone" on:click={() => updateDataHandler('phone')}>
          save
        </button>
        <button type="button" class="btn-gray" name="phone" on:click={() => cancelHandler('phone')}>
          cancel
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .person-data {
    display: grid;
    grid-template-columns: repeat(2, 300px);
    gap: 40px;

  }

  .person-data__item {
    padding: 10px;
    border-bottom: 1px solid #e4e4e4;
  }

  .person-data__label {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 10px;
  }

  .person-data__info {
    font-weight: 900;
    font-size: 24px;
    color: rgb(180, 73, 180);
    text-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
    margin-bottom: 10px;
  }

  .person-data__input {
    width: 100%;
    padding: 5px 10px;
    font-size: 18px;
    border: 1px solid #e4e4e4;
    margin-bottom: 10px;
    border-radius: 2px;
  }

  .person-data__input:focus {
    outline: none;
    border-color: #db5e95;
  }

  .person-data__input::placeholder {
    color: #c2c2c2;
  }

  .mr {
    margin-right: 10px;
  }



</style>
