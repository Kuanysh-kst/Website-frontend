import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/auth',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  login(email, password) {
    return api.post('/authenticate', { email, password })
  },
  register(userData) {
    return api.post('/register', userData)
  }
}