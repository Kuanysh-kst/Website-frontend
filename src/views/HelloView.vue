<template>
  <div>
    <h1>Welcome to Dashboard</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import api from '@/api/http'

export default {
  methods: {
    logout() {
      localStorage.removeItem('jwtToken')
      this.$router.push('/')
    }
  }
}
</script>