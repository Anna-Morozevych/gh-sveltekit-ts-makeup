<script lang="ts">
  import { page } from '$app/stores';
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase/firebase";
  import { goto } from '$app/navigation';
  import { authUser } from "../../store/store";
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let user: User = {
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    phone: '',
    role: '',
    id: ''
  };

  let userId = '';

  authUser.subscribe(data => {
    user = {...data}
  })

  function logOutHandler() {
    signOut(auth)
      .then(() => {
        goto(`${base}/auth`);
        console.log('Logout')
      })
      .catch(err => {
        console.log(err)
      })

    window.localStorage.removeItem('uid');
  }

  let currentPage = $page.route.id;

  onMount(() => {
    let uidFromStorage = window.localStorage.getItem('uid');

    if (uidFromStorage) {
      userId = uidFromStorage;
    }

    if (!userId) {
      goto(`${base}/auth`);
      return;
    }

    if (currentPage) {
      currentPage = currentPage.slice(1);
    }
  })
</script>

<section>
  <div class="contaier">
    <div class="profile page-padding">
      <div class="profile__body">
        <div class="profile__top">
          <div class="profile__title">
            My profile
          </div>
          <h1 class="profile__title">
            Hello, 
            <span class="profile__title-name">{user.firstName}</span>
            <span class="profile__title-name">{user.lastName}</span>
            !
          </h1>

          {#if user.role === 'user'}
            <span class="profile__role profile__role--user">
              {user.role}
            </span>
          {/if}

          {#if user.role === 'admin'}
            <span class="profile__role profile__role--admin">
              {user.role}
            </span>
          {/if}

          {#if user.role === 'manager'}
            <span class="profile__role profile__role--manager">
              {user.role}
            </span>
          {/if}
          
        </div>

        <div class="bread-crumbs">
          <div class="bread-crumbs__body">
            <a href={base} class="bread-crumbs__link bread-crumbs__link--active">My profile</a>
            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 96 960 960" width="16" fill="#db5e95">
              <path d="m304 974-56-57 343-343-343-343 56-57 400 400-400 400Z"/>
            </svg>
            <div class="bread-crumb__div">
            {currentPage}
            </div>
          </div>
        </div>

        <div class="profile__content">
          <div class="profile__nav">
            <a href="{base}/profile" class="profile__nav-link" on:click={() => {}}>
              My data
            </a>
            <a href="{base}/profile/my-orders" class="profile__nav-link" on:click={() => {}}>
              My orders
            </a>
            <a href="{base}/profile/my-comments" class="profile__nav-link" on:click={() => {}}>
              My comments
            </a>

            {#if user.role !== 'user'}
              <a href="{base}/admin" class="profile__nav-link profile__nav-link--{user.role}">
                {user.role} profile
              </a>
            {/if}

            <button class="btn" on:click={() => logOutHandler()}>
              Sign out
            </button>
          </div>

          <div class="profile__info">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
  
</section>

<style>
  .profile__body {
    padding: 60px 0;
  }

  .profile__top {
    position: relative;
    display: flex;
    justify-content: space-between;
    border-bottom: 3px solid #d2347a;
    padding: 0 5px 5px;
  }

  .profile__title {
    font-size: 26px;
    font-weight: 700;
  }

  .profile__title-name {
    font-size: 30px;
    font-weight: 700;
    color: #d2347a;
  }

  .profile__role{
    position: absolute;
    top: -25px;
    right: 0;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 10px;
  }

  .profile__role--user {
    color: rgb(180, 73, 180);
    background-color: rgba(210, 50, 122, 0.2);
 }

  .profile__role--admin {
    color: green;
    background-color: rgba(144, 238, 144, 0.5);
  }

  .profile__role--manager {
    color: blue;
    background-color: rgba(173, 216, 230, 0.5);
  }

  .profile__content {
    display: flex;
  }

  .profile__nav {
    width: 200px;
    border-right: 1px solid #e9e9e9;
    padding-right: 10px;
  }

  .profile__nav-link {
    display: block;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 20px;
    padding: 5px;
  }

  .profile__info {
    width: 100%;
    padding-left: 40px;
  }

  .profile__nav-link--admin {
    color:green;
    background-color: rgba(144, 238, 144, 0.5);
    text-transform: capitalize;
  }

  .profile__nav-link--manager {
    color: blue;
    background-color: rgba(173, 216, 230, 0.5);
    text-transform: capitalize;
  }
</style>