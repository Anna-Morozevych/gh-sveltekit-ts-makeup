// import admin, { initializeApp } from "firebase-admin";

// let firebaseAdmin:admin.app.App;
// let firebaseAdminAuth:admin.auth.Auth;
// initializeApp()

// // create firebase admin singleton
// function getFirebaseAdmin():admin.app.App {
//   if (!firebaseAdmin) {
//     if (admin.apps.length == 0) {
//       firebaseAdmin = admin.initializeApp({
//         credential:admin.credential.cert(JSON.parse(import.meta.env.VITE_FIREBASE_ADMIN_KEY))
//       })
//     }
//   } else {
//     firebaseAdmin = admin.apps[0]!;
//   }

//   return firebaseAdmin
// }

// // create firebase admin auth singleton
// export function getFirebaseAdminAuth():admin.auth.Auth {
//   const currentAdmin: admin.app.App = getFirebaseAdmin();

//   if (!firebaseAdminAuth) {
//     firebaseAdminAuth = currentAdmin.auth();
//   }

//   return firebaseAdminAuth;
// }




import { initializeApp, refreshToken } from 'firebase-admin/app';

initializeApp({
  credential: refreshToken(import.meta.env.VITE_FIREBASE_ADMIN_KEY)
});