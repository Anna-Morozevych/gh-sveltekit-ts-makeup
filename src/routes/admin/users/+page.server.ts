import { getDocs } from 'firebase/firestore';
import type { PageServerLoad } from './$types';
import { colRef } from '$lib/firebase/firebase';

async function getUsers() {
  const snapshot = await getDocs(colRef);

  const data: User[] = snapshot.docs.map((user) => {
    return {
      firstName: user.data().firstName,
      lastName: user.data().lastName,
      email: user.data().email,
      birthday: user.data().birthday,
      phone: user.data().phone,
      role: user.data().role,
      id: user.data().id
    }
  });

  return data;
}


export const load: PageServerLoad = async () => {
  return {
    users: getUsers()
  }
}