import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDlN406Jb2av4TBPM7Mn_1DoDPKHE5S2qU',
  authDomain: 'nextfire-7290d.firebaseapp.com',
  projectId: 'nextfire-7290d',
  storageBucket: 'nextfire-7290d.appspot.com',
  messagingSenderId: '191974976017',
  appId: '1:191974976017:web:513466e057135ef1655fb0',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
