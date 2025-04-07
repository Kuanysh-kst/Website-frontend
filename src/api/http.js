import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1'
})

// Добавляем JWT к каждому запросу
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Перехватчик ответов
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        localStorage.removeItem('jwtToken')
        window.location = '/'
      }
      return Promise.reject(error)
    }
  )

export default api