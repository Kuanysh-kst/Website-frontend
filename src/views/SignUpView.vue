<template>
  <div class="register-view">
    <div class="container">
      <BackButton to="/login" />

      <h1>Create Account</h1>
      <form @submit.prevent="handleRegister">
        <!-- First Name -->
        <div class="form-group">
          <label for="firstName">First Name*</label>
          <input
            type="text"
            id="firstName"
            v-model="form.firstName"
            required
            maxlength="50"
          />
          <div v-if="errors.firstName.length" class="error-message">
            <ul>
              <li v-for="err in errors.firstName" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName">Last Name*</label>
          <input
            type="text"
            id="lastName"
            v-model="form.lastName"
            required
            maxlength="50"
          />
          <div v-if="errors.lastName.length" class="error-message">
            <ul>
              <li v-for="err in errors.lastName" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email*</label>
          <input type="email" id="email" v-model="form.email" required maxlength="50" />
          <div v-if="errors.email.length" class="error-message">
            <ul>
              <li v-for="err in errors.email" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group" style="position: relative">
          <label for="password">Password*</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              required
              maxlength="50"
            />
            <PasswordToggle :show="showPassword" @toggle="showPassword = !showPassword" />
          </div>
          <div v-if="errors.password.length" class="error-message">
            <ul>
              <li v-for="err in errors.password" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Confirm Password -->
        <label for="confirmPassword">Confirm Password*</label>
        <div class="form-group" style="position: relative">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            v-model="form.confirmPassword"
            required
            maxlength="50"
            @input="validatePasswordMatch"
          />
          <PasswordToggle
            :show="showConfirmPassword"
            @toggle="showConfirmPassword = !showConfirmPassword"
          />
          <div v-if="errors.confirmPassword.length" class="error-message">
            <ul>
              <li v-for="err in errors.confirmPassword" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading || !isFormValid">
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
import axios from "axios";
import PasswordToggle from "@/components/PasswordToggle.vue";
import BackButton from "@/components/BackButton.vue";

export default {
  name: "SignupView",
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "ROLE_USER",
      },
      showPassword: false,
      showConfirmPassword: false,
      errors: {
        firstName: [],
        lastName: [],
        email: [],
        password: [],
        confirmPassword: [],
      },
      loading: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  components: {
    PasswordToggle,
    BackButton,
  },

  computed: {
    isFormValid() {
      return (
        this.form.firstName.trim() &&
        this.form.lastName.trim() &&
        this.form.email.trim() &&
        this.form.password.trim() &&
        this.form.confirmPassword.trim() &&
        this.form.password === this.form.confirmPassword
      );
    },
  },
  methods: {
    validatePasswordMatch() {
      this.errors.confirmPassword = [];
      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword.push("Passwords do not match");
      }
    },
    async handleRegister() {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      this.validatePasswordMatch();

      try {
        const response = await axios.post("http://localhost:8080/api/v1/auth/signup", {
          firstname: this.form.firstName,
          lastname: this.form.lastName,
          email: this.form.email,
          password: this.form.password,
          role: this.form.role,
        });

        this.successMessage = "Registration successful! Redirecting...";
        localStorage.setItem("jwtToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userEmail", this.form.email);

        setTimeout(() => this.$router.push("/verify"), 2000);
      } catch (err) {
        if (err.response?.data?.messages) {
          const backendErrors = err.response.data.messages;
          for (const key in this.errors) {
            this.errors[key] = backendErrors[key.toLowerCase()] || [];
          }
        } else {
          this.errorMessage = "Registration failed. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    validatePasswordMatch() {
      this.errors.confirmPassword = [];
      if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword.push("Passwords do not match");
      }
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}
.password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 100%;
  padding-right: 2.5rem; /* Оставляем место для иконки */
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
