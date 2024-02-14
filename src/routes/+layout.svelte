<script lang="ts">
  import '$lib/../global.css';
  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import { categories } from "../data/categories";

  import {onMount} from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
  import { authUser } from '../store/store'
	import { auth, db } from '$lib/firebase/firebase';



  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      let dataToSetToStore: User;

      if (user) {
        window.localStorage.setItem('uid', user.uid);
        const docRef = doc(db, 'users', user.uid);
          onSnapshot(docRef, (doc) => {
            const userData= doc.data();
            dataToSetToStore = {
              firstName: userData?.firstName,
              lastName: userData?.lastName,
              email: userData?.email,
              birthday: userData?.birthday,
              phone: userData?.phone,
              role: userData?.role,
              id: userData?.id
            };

            authUser.set({ ...dataToSetToStore })
          })
      }

      authUser.update(curr => {
        return {
          ...curr,
          ...dataToSetToStore
        }
      })
    })

  })
</script>

  <Navbar />


  <slot />


  <Footer categories={categories} />

