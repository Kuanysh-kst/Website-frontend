<template>
  <div class="register-view">
    <div class="container">
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
            @input="validateLength('firstName', 'First Name')"
            required
            maxlength="50"
          />
          <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName">Last Name*</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            placeholder="Enter your last name"
            @input="validateLength('lastName', 'Last Name')"
            required
            maxlength="50"
          />
          <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>
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
            maxlength="50"
          />
          <div v-if="errors.email.length" class="error-message">
            <ul>
              <li v-for="(error, index) in errors.email" :key="index">{{ error }}</li>
            </ul>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password*</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              placeholder="Enter your password"
              @input="validatePassword"
              required
              maxlength="50"
            />
            <span class="toggle-password" @click="togglePasswordVisibility('password')">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
          <div v-if="errors.password.length" class="error-message">
            <ul>
              <li v-for="(error, index) in errors.password" :key="index">{{ error }}</li>
            </ul>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password*</label>
          <div class="password-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="form.confirmPassword"
              placeholder="Confirm your password"
              @input="validatePasswordMatch"
              required
              maxlength="50"
            />
            <span
              class="toggle-password"
              @click="togglePasswordVisibility('confirmPassword')"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
          <div v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="!formValid || loading">
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
      role: "ROLE_USER", // Установлена роль по умолчанию
    });

    const errors = ref({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const showPassword = ref(false); // Состояние для отображения/скрытия пароля
    const showConfirmPassword = ref(false); // Состояние для отображения/скрытия подтверждения пароля

    const togglePasswordVisibility = (field) => {
      if (field === "password") {
        showPassword.value = !showPassword.value;
      } else if (field === "confirmPassword") {
        showConfirmPassword.value = !showConfirmPassword.value;
      }
    };

    const formValid = computed(() => {
      return (
        form.value.firstName &&
        form.value.lastName &&
        form.value.email &&
        form.value.password &&
        form.value.confirmPassword &&
        !errors.value.firstName &&
        !errors.value.lastName &&
        !errors.value.email &&
        !errors.value.password &&
        !errors.value.confirmPassword
      );
    });

    const validateLength = (field, fieldName) => {
      if (form.value[field].length >= 50) {
        errors.value[field] = "The limit is 50 characters";
      } else {
        errors.value[field] = "";
      }
    };

    const validateEmail = () => {
      const emailErrors = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (form.value.email.length < 15) {
        emailErrors.push("Email must contain at least 15 characters");
      }
      if (!emailRegex.test(form.value.email)) {
        emailErrors.push("Please enter a valid email address");
      }
      if (form.value.email.length >= 50) {
        emailErrors.push("The limit is 50 characters");
      }

      errors.value.email = emailErrors; // Сохраняем массив ошибок
    };

    const validatePassword = () => {
      const passwordErrors = [];

      if (form.value.password.length < 8) {
        passwordErrors.push("Password must be at least 8 characters");
      }
      if (form.value.password.length >= 50) {
        passwordErrors.push("The limit is 50 characters");
      }

      errors.value.password = passwordErrors; // Сохраняем массив ошибок
      validatePasswordMatch();
    };

    const validatePasswordMatch = () => {
      const confirmPasswordErrors = [];

      if (form.value.password !== form.value.confirmPassword) {
        confirmPasswordErrors.push("Passwords do not match");
      }
      if (form.value.confirmPassword.length >= 50) {
        confirmPasswordErrors.push("The limit is 50 characters");
      }

      errors.value.confirmPassword = confirmPasswordErrors; // Сохраняем массив ошибок
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
          role: form.value.role, // Всегда "USER"
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
      validateLength,
      validateEmail,
      validatePassword,
      validatePasswordMatch,
      handleRegister,
      showPassword,
      showConfirmPassword,
      togglePasswordVisibility,
    };
  },
};
</script>

<style scoped>
.register-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin-top: 1rem;
  margin-bottom: 1rem;
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

button {
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

button:hover:not(:disabled) {
  background-color: #0069d9;
}

button:disabled {
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

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 100%;
  padding-right: 2.5rem; /* Оставляем место для иконки */
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  cursor: pointer;
  color: #007bff;
  font-size: 1.25rem;
}

.toggle-password:hover {
  color: #0056b3;
}

.error-message ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.error-message li {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
