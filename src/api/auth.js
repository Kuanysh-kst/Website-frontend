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
  signup(userData) {
    return api.post('/signup', userData)
  },
  verify(email, verificationCode) {
    return api.post('/verify', { email, verificationCode })
  },
  resend(email) {
    return api.post('/resend', { email })
  }
}