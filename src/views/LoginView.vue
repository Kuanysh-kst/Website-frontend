<template>
  <div class="login-view">
    <div class="container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email (min 15 characters)</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            @input="validateEmail"
            required
            maxlength="50"
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </div>
        <div class="form-group">
          <label for="password">Password (min 8 characters)</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              @input="validatePassword"
              required
              maxlength="50"
            />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>
        <button type="submit" :disabled="isBlocked || !formValid">
          {{ isBlocked ? `Blocked (${remainingTime}s)` : "Login" }}
        </button>
        <div class="register-prompt">
          <span>Not registered yet?</span>
          <router-link to="/register">Create an account</router-link>
        </div>
        <div v-if="authError" class="error-message">{{ authError }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import authApi from "@/api/auth";
import { useRouter } from "vue-router";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      authError: "",
      failedAttempts: 0,
      isBlocked: false,
      remainingTime: 60,
      blockTimer: null,
      showPassword: false, // Состояние для отображения/скрытия пароля
    };
  },
  computed: {
    formValid() {
      return (
        this.email.length <= 50 &&
        this.password.length >= 8 &&
        !this.emailError &&
        !this.passwordError
      );
    },
  },
  methods: {
    validateEmail() {
      if (this.email.length >= 50) {
        this.emailError = "The limit is 50 characters";
      } else if (this.email.length < 15) {
        this.emailError = "Username must contain at least 15 characters";
      } else {
        this.emailError = "";
      }
    },
    validatePassword() {
      if (this.password.length >= 50) {
        this.passwordError = "The limit is 50 characters";
      } else if (this.password.length < 8) {
        this.passwordError = "Password must contain at least 8 characters";
      } else {
        this.passwordError = "";
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    blockUser() {
      this.isBlocked = true;
      this.remainingTime = 60;

      this.blockTimer = setInterval(() => {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
          clearInterval(this.blockTimer);
          this.isBlocked = false;
          this.failedAttempts = 0;
        }
      }, 1000);
    },
    async handleLogin() {
      // Валидация перед отправкой
      this.validateEmail();
      this.validatePassword();

      if (!this.formValid || this.isBlocked) return;

      try {
        const response = await authApi.login(this.email, this.password);

        // Сброс счетчика неудачных попыток при успешном входе
        this.failedAttempts = 0;

        // Сохраняем токен
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);

        // Перенаправляем на защищенную страницу
        this.$router.push("/hello");
      } catch (error) {
        this.failedAttempts++;

        if (this.failedAttempts >= 3) {
          this.blockUser();
          this.authError = "Your account is blocked for 1 minute";
        } else {
          this.authError = "Invalid email or password";
        }

        console.error("Login error:", error);
      }
    },
  },
  beforeUnmount() {
    if (this.blockTimer) {
      clearInterval(this.blockTimer);
    }
  },
};
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
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

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.register-prompt {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.register-prompt a {
  color: #007bff;
  text-decoration: none;
  margin-left: 5px;
}

.register-prompt a:hover {
  text-decoration: underline;
}
</style>
