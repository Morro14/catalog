import { useState } from "react"
import serverURL from '../App'
import axios from "axios"


export default function PassRecover() {
  const [loading, setLoading] = useState(true)
  const url = serverURL + 'auth/get-token'

  async function getToken() {
    const r = await axios.get(url).then((r) => r)
    return r
  }





  return
} 