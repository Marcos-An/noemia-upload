import axios from 'axios'

const api = axios.create({
  baseURL: 'https://noemia.herokuapp.com/posts'
})

export default api

