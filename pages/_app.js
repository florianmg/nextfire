import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context'
import Navbar from '../components/NavBar'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <UserContext.Provider value={{ user: {}, username: 'florianmg' }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default MyApp
