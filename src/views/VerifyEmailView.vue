<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Verify Your Email
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          Please enter the verification code sent to your email.
        </p>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="handleVerification" class="space-y-6">
          <div>
            <label for="verificationCode" class="block text-sm font-medium text-gray-900">
              Verification Code
            </label>
            <div class="mt-2">
              <input
                type="text"
                id="verificationCode"
                v-model="verificationCode"
                placeholder="Enter the code"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
  
          <div v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</div>
          <div v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</div>
  
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {{ loading ? "Verifying..." : "Verify" }}
            </button>
          </div>
        </form>
  
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">Didn't receive the code?</p>
          <button
            @click="handleResend"
            :disabled="resendLoading"
            class="mt-2 inline-flex items-center justify-center rounded-md border border-indigo-600 px-4 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
          >
            {{ resendLoading ? "Resending..." : "Resend Code" }}
          </button>
          <div
            v-if="resendMessage"
            :class="[
              'mt-2 text-sm',
              resendSuccess ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ resendMessage }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  
  const verificationCode = ref("");
  const loading = ref(false);
  const resendLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");
  const resendMessage = ref("");
  const resendSuccess = ref(false);
  
  const router = useRouter();
  
  const handleVerification = async () => {
    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";
  
    try {
      await axios.post("http://localhost:8080/api/v1/auth/verify", {
        verificationCode: verificationCode.value,
        email: localStorage.getItem("userEmail"),
      });
  
      successMessage.value = "Email verified successfully!";
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      errorMessage.value =
        err.response?.data?.errors?.verificationCode?.[0] ||
        err.response?.data?.message ||
        "Verification failed. Please try again.";
    } finally {
      loading.value = false;
    }
  };
  
  const handleResend = async () => {
    resendLoading.value = true;
    resendMessage.value = "";
    resendSuccess.value = false;
  
    try {
      await axios.post("http://localhost:8080/api/v1/auth/resend", {
        email: localStorage.getItem("userEmail"),
      });
  
      resendMessage.value = "Verification code has been resent.";
      resendSuccess.value = true;
    } catch (err) {
      resendMessage.value =
        err.response?.data?.message || "Failed to resend the code.";
      resendSuccess.value = false;
    } finally {
      resendLoading.value = false;
    }
  };
  </script>
  