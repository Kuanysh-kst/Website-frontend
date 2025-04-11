<template>
  <div class="register-view">
    <div class="container">
      <h1>Create Account</h1>
      <form @submit.prevent="handleRegister">
        <!-- First Name -->
        <div class="form-group">
          <label for="firstName">First Name*</label>
          <input type="text" id="firstName" v-model="form.firstName" required maxlength="50" />
          <div v-if="errors.firstName.length" class="error-message">
            <ul><li v-for="err in errors.firstName" :key="err">{{ err }}</li></ul>
          </div>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName">Last Name*</label>
          <input type="text" id="lastName" v-model="form.lastName" required maxlength="50" />
          <div v-if="errors.lastName.length" class="error-message">
            <ul><li v-for="err in errors.lastName" :key="err">{{ err }}</li></ul>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email*</label>
          <input type="email" id="email" v-model="form.email" required maxlength="50" />
          <div v-if="errors.email.length" class="error-message">
            <ul><li v-for="err in errors.email" :key="err">{{ err }}</li></ul>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password*</label>
          <input type="password" id="password" v-model="form.password" required maxlength="50" />
          <div v-if="errors.password.length" class="error-message">
            <ul><li v-for="err in errors.password" :key="err">{{ err }}</li></ul>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password*</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" required maxlength="50" />
          <div v-if="errors.confirmPassword.length" class="error-message">
            <ul><li v-for="err in errors.confirmPassword" :key="err">{{ err }}</li></ul>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading">
          {{ loading ? "Processing..." : "Register" }}
        </button>

        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="login-link">
          Already have an account? <router-link to="/login">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'ROLE_USER'
    });

    const errors = ref({
      firstName: [],
      lastName: [],
      email: [],
      password: [],
      confirmPassword: []
    });

    const loading = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');

    const validatePasswordMatch = () => {
      errors.value.confirmPassword = [];
      if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword.push('Passwords do not match');
      }
    };

    const handleRegister = async () => {
      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      validatePasswordMatch();

      try {
        const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
          firstname: form.value.firstName,
          lastname: form.value.lastName,
          email: form.value.email,
          password: form.value.password,
          role: form.value.role
        });

        successMessage.value = 'Registration successful! Redirecting...';
        localStorage.setItem('jwtToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        setTimeout(() => router.push('/login'), 2000);
      } catch (err) {
        if (err.response?.data?.messages) {
          const backendErrors = err.response.data.messages;
          for (const key in errors.value) {
            errors.value[key] = backendErrors[key.toLowerCase()] || [];
          }
        } else {
          errorMessage.value = 'Registration failed. Please try again.';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      errors,
      loading,
      successMessage,
      errorMessage,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background: #f5f5f5;
}
.container {
  background: #fff;
  padding: 2rem;
  margin-top: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.error-message {
  color: #dc3545;
  font-size: 0.9rem;
}
.success-message {
  color: #28a745;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
}
button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>