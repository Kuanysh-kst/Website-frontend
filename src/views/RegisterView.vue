<template>
  <div class="register-view">
    <div class="register-container">
      <h1>Register</h1>
      <form @submit.prevent="handleRegister">
        <!-- Поля регистрации -->
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import authApi from '@/api/auth'
import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      userData: {
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      }
    }
  },
  methods: {
    async handleRegister() {
      try {
        const response = await authApi.register(this.userData)
        localStorage.setItem('jwtToken', response.data.token)
        this.$router.push('/dashboard')
      } catch (error) {
        console.error("Registration error:", error)
      }
    }
  }
}
</script>