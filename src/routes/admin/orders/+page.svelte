<script lang="ts">
	import { base } from "$app/paths";
  import Close from "$lib/images/close.svg";
  import type { PageServerData } from "./$types";
  import { statusList } from '$lib/data/statusList';
	import Progress from "$lib/components/Progress.svelte";
	import { doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
	import { db, ordersRef } from "$lib/firebase/firebase";

  export let data:PageServerData;

  let orders: Order[] = [];
  let users: User[] = data?.users;
  let activeRowId = '';
  let selectedOrder: Order;
  let isShowDetails = false;
  let selectedOrderStatus: string = '';


  onSnapshot(ordersRef, (snapshot) => {
    let ordersToChange: Order[] = [];

    snapshot.docs.forEach((doc) => {
      const element = doc.data();
      ordersToChange.push({
        date: element?.date,
        orderId: doc.id,
        orderInfo: element?.orderInfo,
        userId: element?.userId,
        status: element?.status,
      });
    })

    orders = [...ordersToChange];
  })

  function findUser(id: string) {
    const user = users.find(el => el.id === id);

    return user;
  }

  function setActiveRow(event: MouseEvent & {currentTarget: EventTarget & HTMLTableRowElement}) {
    const target = event.currentTarget;
    activeRowId = target.id;

    if (activeRowId) {
      let findOrder = orders.find(order => order.orderId === activeRowId);
       if (findOrder) {
        selectedOrder = {...findOrder};
        selectedOrderStatus = selectedOrder.status;
       }
    }
  }

  function showOrderDetails(orderId: string) {
    activeRowId = orderId;
    isShowDetails = true;

    if (activeRowId) {
      let findOrder = orders.find(order => order.orderId === activeRowId);
       if (findOrder) {
        selectedOrder = {...findOrder};
        selectedOrderStatus = selectedOrder.status;
       }
    }
  }

  function closeOrderDetails() {
    isShowDetails = false;
  }

  function findStatus(name: string) {
    let list = [...statusList];

    return list.find(el => el.name === name);
  }

  function calculateTotalSum(products: Product[]) {
    return products.reduce((sum, el) => +el.price + sum, 0);
  }

  function saveNewStatus(status: string, id: string) {
    console.log('saveNewStatus ===>>>', status);
    const docRef = doc(db, 'orders', id);

    updateDoc(docRef, {
      status,
    })
    .then(() => {
      console.log(`Status was updedted on ${status}`);
      pushNotification('Order status was chnged');
    })
  }

  function pushNotification(message: string) {
    const body = document.querySelector('body');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.classList.add('success');
    notification.textContent = message;

    body?.append(notification);

    setTimeout(() => {
      notification.remove()
    }, 3000);
  }

</script>


<h2 class="title-small">
  Orders data
</h2>

<table>
  <tr>
    <th>Order №</th>
    <th>Date</th>
    <th>Customer</th>
    <th>Total sum</th>
    <th>Order Status</th>
    <th>Edit order</th>
  </tr>

  {#each orders as order}
    <tr
      on:click={(event) => {setActiveRow(event)}}
      class="{activeRowId === order.orderId ? 'row-active' : ''}"
      id={order.orderId}
      tabindex=0
    >
      <td>{order.orderId.slice(-8)}</td>
      <td>{order.date}</td>
      <!-- <td>{parseDate(order.date.seconds)}</td> -->

      <td>
        <button
          type="button"
          title="Show user details"
        >
          {#if order.userId}
            {findUser(order.userId)?.firstName} {findUser(order.userId)?.lastName}
          {:else}
            Guest
          {/if}
        </button>
      </td>

      <td>{order.orderInfo.reduce((sum, el) => +el.price + sum, 0)}</td>

      <td>
        <span
          class="status"
          style={`background-color: ${findStatus(order.status)?.color}`}
        >
          {order.status}
        </span>
      </td>

      <td>
        <button class="show-btn" on:click={() => {showOrderDetails(order.orderId)}}>
          Show details
        </button>
      </td>
    </tr>
  {/each}
</table>

{#if isShowDetails}
  <div class="popup {isShowDetails? 'popup--open': ''}">
    <a
      href="{base}/"
      class="popup__close"
      on:click|preventDefault={() => {closeOrderDetails()}}
    >
      <img src="{Close}" alt="close">
    </a>

    <div class="popup_title-wrap">
      <h3 class="title-small popup__title">
        Order № {selectedOrder?.orderId.slice(-8)}
      </h3>
      <h4>
        Date: {selectedOrder ? selectedOrder.date : ''}
      </h4>
    </div>

    <div class="popup__item">
      <div class="popup__label">
        Order status:
      </div>

      <div class="popup__info">
        current status:
        <span
          class="status"
          style={findStatus(selectedOrderStatus) ? `background-color: ${findStatus(selectedOrderStatus)?.color}` : ''}
        >
          {findStatus(selectedOrderStatus)?.name}
        </span>
      </div>

      <div class="popup__progress">
        <Progress status={selectedOrderStatus}/>
      </div>

      <div class="popup__info">
        Change status:
        <select class="status-select" name="status" bind:value={selectedOrderStatus}>
          {#each statusList as status}
            <option value="{status.name}">{status.name}</option>
          {/each}
        </select>

        <button class="popup__save" type="button" on:click={() => {saveNewStatus(selectedOrderStatus, selectedOrder.orderId)}}>
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
      </div>
    </div>

    <div class="popup__item">
      <div class="popup__label">
        Customer info:
      </div>

      <div class="popup__info ">
        name:
        <span class="popup__info--bold">
          {#if selectedOrder?.userId}
          {findUser(selectedOrder.userId)?.firstName} {findUser(selectedOrder.userId)?.lastName}
            {:else}
            Guest
          {/if}
        </span>
      </div>

      <div class="popup__info">
        email:
        <span class="popup__info--bold">
          {#if selectedOrder?.userId}
            {findUser(selectedOrder.userId)?.email}
            {:else}
            email is missing
          {/if}
        </span>
      </div>
      <div class="popup__info">
        phone:
        <span class="popup__info--bold">
          {#if selectedOrder?.userId}
            {findUser(selectedOrder.userId)?.phone}
            {:else}
            phone is missing
          {/if}
        </span>
      </div>
      <div class="popup__info">
        birthday:
        <span class="popup__info--bold">
          {#if selectedOrder?.userId}
            {findUser(selectedOrder.userId)?.birthday}
            {:else}
            phone is missing
          {/if}
        </span>
      </div>
    </div>

    <div class="popup__item">
      <div class="popup__label">
        Order info:
      </div>

      {#if selectedOrder?.orderInfo}
        {#each selectedOrder?.orderInfo as product}
          <div class="popup__img-wrap">
            <img src="{product.api_featured_image}" class="popup__img" alt="{product.name}">
          </div>
          <div class="popup__info">
            product name:
            <span class="popup__info--bold">
              {product.name}
            </span>
          </div>
          <div class="popup__info">
            product brand:
            <span class="popup__info--bold">
              {product.brand}
            </span>
          </div>
          <div class="popup__info">
            product type:
            <span class="popup__info--bold">
              {product.product_type.replace('_', ' ')}
            </span>
          </div>
          {#if product.selectedColor?.colour_name}
            <div class="popup__info popup__info--flex">
              selected color:
              <span class="popup__product-color" style={`background-color: ${product.selectedColor?.hex_value};`}></span>
            </div>
            <div class="popup__info">
              selected color name:
              <span class="popup__info--bold">
                {product.selectedColor?.colour_name}
              </span>
            </div>
            {/if}
          <div class="popup__info">
            product price:
            <span class="popup__info--bold">
              ${product.price}
            </span>
          </div>
        {/each}
      {/if}
    </div>

    <div class="popup__item">
      <div class="popup__total">
        <div>
          Total:
        </div>
        <div>
          ${calculateTotalSum(selectedOrder.orderInfo)}
        </div>
      </div>
    </div>
  </div>
{/if}


<style>
  table {
    width: 100%;
  }

  .row-active, tr:nth-child(odd).row-active {
    background-color: rgba(210, 50, 122, 0.2);
  }

  tr {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  tr:not(:first-child):hover {
    background-color: rgba(210, 50, 122, 0.2);
    cursor: pointer;
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

  .status {
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 8px;
    text-transform: uppercase;
    border: none;
  }

  .status-select {
    text-transform: uppercase;
    padding: 2px 8px;
    border: 1px solid #d2347a;
    border-radius: 8px;
    outline: none;
    margin: 0 0 0 10px;
  }

  .status-select:focus {
    border-color: #d2347a;
  }

  td button {
    font-size: inherit;
    font-weight: inherit;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  .show-btn {
    background-color: #e1e1e1;
    padding: 4px 8px;
    border-radius: 8px;
    text-transform: uppercase;
    border: 2px solid grey;
    font-size: inherit;
    color: grey;
  }

  .show-btn:hover {
    background-color: #fff;
    color: #d2347a;
    border-color: #d2347a;
  }
  option {
    background-color: #ffffff;
  }

  @keyframes closePopup {
    0% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(100%);
    }
  }

  @keyframes openPopup {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(0%);
    }
  }

  .popup {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    background-color: #fff;
    box-shadow: rgba(210, 50, 122, 0.2) 0px 3px 8px;
    z-index: 100;
    transform: translateX(0%);
    animation: closePopup 0.5s ease-out;
    padding: 40px;
    max-height: 100vh;
    overflow: auto;
  }

  .popup--open {
    animation: openPopup 0.5s ease-out;
  }

  .popup__close {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 4px;
  }

  .popup__close:hover {
    box-shadow: rgba(210, 50, 122, 0.8) 0px 3px 8px;
  }

  .popup_title-wrap {
    margin-bottom: 40px;
  }

  .popup__title {
    margin-bottom: 20px;
  }

  .popup__item {
    margin-bottom: 20px;
    padding-bottom: 4px;
  }

  .popup__label {
    font-size: 18px;
    font-weight: 700;
    padding: 4px 0;
    background-color: rgba(210, 50, 122, 0.2);
    margin-bottom: 10px;
  }

  .popup__total {
    display: flex;
    justify-content: space-between;
    background-color: #d2347a;
    padding: 4px;
  }

  .popup__total div {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
  }

  .popup__info {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  .popup__info--flex {
    display: flex;
    align-items: center;
  }

  .popup__info--bold {
    font-weight: 700;
    color: #d2347a;
    font-size: inherit;
  }

  .popup__progress {
    margin: 20px 0;
  }

  .popup__img-wrap {
    width: 200px;
    height: 150px;
  }

  .popup__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .popup__product-color {
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: 5px;
    border: 2px solid black;
  }

  .popup__save {
    background-color: #fff;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: 20px;
  }

  .popup__save i {
    font-size: 24px;
    color: #d2347a;
    padding: 4px;
    box-shadow: rgba(128, 128, 128, 0.8) 0px 3px 8px;
    border-radius: 4px;
    text-align: center;
  }

  .popup__save:hover {
    box-shadow: rgba(210, 50, 122, 0.8) 0px 3px 8px;
  }

  @media screen and (max-width: 767px){
    .popup {
      width: 100%;
    }
  }



</style>