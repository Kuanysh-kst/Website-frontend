<template>
    <div class="verify-email-view">
      <div class="container">
        <h1>Verify Your Email</h1>
        <p>Please enter the verification code sent to your email.</p>
  
        <form @submit.prevent="handleVerification">
          <div class="form-group">
            <label for="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              v-model="verificationCode"
              placeholder="Enter the code"
              required
            />
          </div>
  
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  
          <button type="submit" :disabled="loading">
            {{ loading ? "Verifying..." : "Verify" }}
          </button>
        </form>
  
        <div class="resend-section">
          <p>Didn't receive the code?</p>
          <button @click="handleResend" :disabled="resendLoading">
            {{ resendLoading ? "Resending..." : "Resend Code" }}
          </button>
          <div
            v-if="resendMessage"
            :class="{
              'resend-message': true,
              'success-message': resendSuccess,
              'error-message': !resendSuccess,
            }"
          >
            {{ resendMessage }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "VerifyEmailView",
    data() {
      return {
        verificationCode: "",
        loading: false,
        resendLoading: false,
        errorMessage: "",
        successMessage: "",
        resendMessage: "",
        resendSuccess: false,
      };
    },
    methods: {
      async handleVerification() {
        this.loading = true;
        this.errorMessage = "";
        this.successMessage = "";
  
        try {
          await axios.post("http://localhost:8080/api/v1/auth/verify", {
            verificationCode: this.verificationCode,
            email: localStorage.getItem("userEmail"),
          });
  
          this.successMessage = "Email verified successfully!";
          setTimeout(() => this.$router.push("/login"), 1500);
        } catch (err) {
          this.errorMessage =
            err.response?.data?.errors?.verificationCode?.[0] ||
            err.response?.data?.message ||
            "Verification failed. Please try again.";
        } finally {
          this.loading = false;
        }
      },
  
      async handleResend() {
        this.resendLoading = true;
        this.resendMessage = "";
        this.resendSuccess = false;
  
        try {
          await axios.post("http://localhost:8080/api/v1/auth/resend", {
            email: localStorage.getItem("userEmail"),
          });
  
          this.resendMessage = "Verification code has been resent.";
          this.resendSuccess = true;
        } catch (err) {
          this.resendMessage =
            err.response?.data?.message || "Failed to resend the code.";
          this.resendSuccess = false;
        } finally {
          this.resendLoading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .verify-email-view {
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
    margin-top: 0.5rem;
  }
  
  .success-message {
    color: #28a745;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
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
  
  .resend-section {
    margin-top: 2rem;
    text-align: center;
  }
  </style>
  