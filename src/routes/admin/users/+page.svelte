<script lang="ts">
	import type { PageServerData } from "./$types";
	import { authUser } from "../../../store/store";




  export let data:PageServerData;

  let currentUser: User = {
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    phone: '',
    role: '',
    id: ''
  };


  authUser.subscribe(data => {
    currentUser = {...data};
  })

  let users: User[] = data.users;

// console.log(data.users);

function getUsers(uid: string) {
  
}

function userRowClick(id: string) {
  // console.log('user row click', id);
}

</script>

<h2 class="title-small">
  Users data
</h2>

<table>
  <tr>
    <th>User name</th>
    <th>User email</th>
    <th>User phone</th>
    <th>User role</th>
    {#if currentUser.role === 'admin'}
    <th>
      Reset password
    </th>
  {/if}
  </tr>
  {#each users as user}
    <tr tabindex="0" on:click={() => {userRowClick(user.id)}}>
      <td>
        {user.firstName} {user.lastName}
      </td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>
        {#if user.role === 'admin'}
          <span class="admin">
            {user.role}
          </span>
        {/if}
        {#if user.role === 'manager'}
          <span class="manager">
            {user.role}
          </span>
        {/if}
        {#if user.role === 'user'}
          <span class="user">
            {user.role}
          </span>
        {/if}
      </td>

      {#if currentUser.role === 'admin'}
        <td>
          <button type="button" class="btn reset-btn" on:click={() => getUsers(user.id)}>
            Reset password
          </button>
        </td>
      {/if}
    </tr>
  {/each}
</table>

<style>
  table {
    width: 100%;
  }

  tr {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  tr:nth-child(odd) {
    background-color: #e4e4e4;
  }

  th, td {
    padding: 10px 0;
    width: 100%;
    font-size: 16px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  th {
    background-color: #d2347a;
    color: #ffffff;
  }

  td:first-child {
    justify-content: start;
    padding-left: 10px;
  }

  td, th {
    font-weight: 600;
  }

  .admin {
    color: green;
    background-color: rgba(144, 238, 144, 0.5);
    padding: 5px 10px;
    border-radius: 10px;
    text-transform: uppercase;
    font-size: inherit;
    font-weight: inherit;
  }

  .manager {
    color: blue;
    background-color: rgba(173, 216, 230, 0.5);
    padding: 5px 10px;
    border-radius: 10px;
    text-transform: uppercase;
    font-size: inherit;
    font-weight: inherit;
  }

  .user {
    color: rgb(180, 73, 180);
    background-color: rgba(210, 50, 122, 0.2);
    padding: 5px 10px;
    border-radius: 10px;
    text-transform: uppercase;
    font-size: inherit;
    font-weight: inherit;
  }

  .reset-btn {
    margin:  0 auto;
  }
</style>