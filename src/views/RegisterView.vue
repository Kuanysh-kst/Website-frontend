<template>
  <div class="register-view">
    <div class="register-container">
      <h1>Create Account</h1>
      <form @submit.prevent="handleRegister">
        <!-- First Name -->
        <div class="form-group">
          <label for="firstName">First Name*</label>
          <input
            type="text"
            id="firstName"
            v-model="form.firstName"
            placeholder="Enter your first name"
            required
          />
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName">Last Name*</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            placeholder="Enter your last name"
            required
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email*</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="Enter your email"
            @input="validateEmail"
            required
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password* (min 8 characters)</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="Enter your password"
            @input="validatePassword"
            required
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password*</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            placeholder="Confirm your password"
            @input="validatePasswordMatch"
            required
          />
          <div v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="register-button" :disabled="!formValid || loading">
          {{ loading ? "Processing..." : "Register" }}
        </button>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <!-- Login Link -->
        <div class="login-link">
          Already have an account? <router-link to="/login">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "RegisterView",
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const successMessage = ref("");
    const errorMessage = ref("");

    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ROLE_USER" // Установлена роль по умолчанию
    });

    const errors = ref({
      email: "",
      password: "",
      confirmPassword: "",
    });

    const formValid = computed(() => {
      return (
        form.value.firstName &&
        form.value.lastName &&
        form.value.email &&
        form.value.password &&
        form.value.confirmPassword &&
        !errors.value.email &&
        !errors.value.password &&
        !errors.value.confirmPassword
      );
    });

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.value.email)) {
        errors.value.email = "Please enter a valid email address";
      } else {
        errors.value.email = "";
      }
    };

    const validatePassword = () => {
      if (form.value.password.length < 8) {
        errors.value.password = "Password must be at least 8 characters";
      } else {
        errors.value.password = "";
      }
      validatePasswordMatch();
    };

    const validatePasswordMatch = () => {
      if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = "Passwords do not match";
      } else {
        errors.value.confirmPassword = "";
      }
    };

    const handleRegister = async () => {
      if (!formValid.value) return;

      loading.value = true;
      errorMessage.value = "";

      try {
        const response = await axios.post("http://localhost:8080/api/v1/auth/register", {
          firstname: form.value.firstName,
          lastname: form.value.lastName,
          email: form.value.email,
          password: form.value.password,
          role: form.value.role // Всегда "USER"
        });

        successMessage.value = "Registration successful! Redirecting to login...";

        // Save tokens if needed
        localStorage.setItem("jwtToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Redirect after delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("Registration error:", error);
        errorMessage.value =
          error.response?.data?.message || "Registration failed. Please try again.";
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
      formValid,
      validateEmail,
      validatePassword,
      validatePasswordMatch,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}

.register-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.register-button:hover:not(:disabled) {
  background-color: #0069d9;
}

.register-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success-message {
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>