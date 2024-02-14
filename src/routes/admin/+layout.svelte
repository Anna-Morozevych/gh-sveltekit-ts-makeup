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
    id: '',
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

  let currentPage = $page.url.pathname;
  let activeLink = currentPage.slice(currentPage.lastIndexOf('/') + 1);

  onMount(() => {
    let uidFromStorage = window.localStorage.getItem('uid');

    if (uidFromStorage) {
      userId = uidFromStorage;
    }

    if (!userId || user.role === 'user') {
      goto(`${base}/`);
      return;
    }
    
  })

  function setActiveLink(event:MouseEvent & {currentTarget: EventTarget & HTMLAnchorElement}) {
    const target = event.currentTarget.pathname;
    activeLink = target.slice(target.lastIndexOf('/')+1)
  }
</script>

<section>
  <div class="contaier">
    <div class="profile page-padding">
      <div class="profile__body">
        <div class="profile__top">
          <div class="profile__title">
            {user.role} panel
          </div>
          <h1 class="profile__title-name">
            {user.firstName} {user.lastName}
          </h1>

          <span
            class="profile__role {user.role === 'admin'? "profile__role--admin" : "profile__role--manager"}">
            {user.role}
          </span>
        </div>

        <div class="admin-nav">
          <a
            href="{base}/admin"
            class="admin-nav__link {activeLink === 'admin' ? 'admin-nav__link--active' : ''}"
            on:click={(event) => {setActiveLink(event)}}
          >
            Main
          </a>
          <a
            href="{base}/admin/users"
            class="admin-nav__link {activeLink === 'users' ? 'admin-nav__link--active' : ''}"
            on:click={(event) => {setActiveLink(event)}}
          >
            Users
          </a>
          <a
            href="{base}/admin/orders"
            class="admin-nav__link {activeLink === 'orders' ? 'admin-nav__link--active' : ''}"
            on:click={(event) => {setActiveLink(event)}}
          >
          Orders
          </a>
          <a
            href="{base}/admin/comments"
            class="admin-nav__link {activeLink === 'comments' ? 'admin-nav__link--active' : ''}"
            on:click={(event) => {setActiveLink(event)}}
          >
          Comments
          </a>
          <a
            href="{base}/admin/messages"
            class="admin-nav__link {activeLink === 'messages' ? 'admin-nav__link--active' : ''}"
            on:click={(event) => {setActiveLink(event)}}
          >
          Messages
          </a>
        </div>

        <slot />
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
    margin-bottom: 20px;
  }

  .profile__title {
    font-size: 26px;
    font-weight: 700;
    text-transform: capitalize;
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

  .profile__role--admin {
    color: green;
    background-color: rgba(144, 238, 144, 0.5);
  }

  .profile__role--manager {
    color: blue;
    background-color: rgba(173, 216, 230, 0.5);
  }

  .admin-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .admin-nav__link {
    display: block;
    width: 100%;
    font-size: 18px;
    font-weight: 700;
    padding: 10px;
    background-color: #e9e9e9;
    text-align: center;
  }

  .admin-nav__link--active {
    background-color: #d2347a;
    color: #ffffff;
  }
</style>