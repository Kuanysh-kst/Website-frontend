<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import authApi from "@/api/auth";

const router = useRouter();

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const authError = ref("");
const failedAttempts = ref(0);
const isBlocked = ref(false);
const remainingTime = ref(60);
const blockTimer = ref(null);
const showPassword = ref(false);

const formValid = computed(() => {
  return (
    email.value.length <= 50 &&
    password.value.length >= 8 &&
    !emailError.value &&
    !passwordError.value
  );
});

function validateEmail() {
  if (email.value.length >= 50) {
    emailError.value = "The limit is 50 characters";
  } else if (email.value.length < 15) {
    emailError.value = "Username must contain at least 15 characters";
  } else {
    emailError.value = "";
  }
}

function validatePassword() {
  if (password.value.length >= 50) {
    passwordError.value = "The limit is 50 characters";
  } else if (password.value.length < 8) {
    passwordError.value = "Password must contain at least 8 characters";
  } else {
    passwordError.value = "";
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function blockUser() {
  isBlocked.value = true;
  remainingTime.value = 60;
  blockTimer.value = setInterval(() => {
    remainingTime.value--;
    if (remainingTime.value <= 0) {
      clearInterval(blockTimer.value);
      isBlocked.value = false;
      failedAttempts.value = 0;
    }
  }, 1000);
}

async function handleLogin() {
  validateEmail();
  validatePassword();

  if (!formValid.value || isBlocked.value) return;

  try {
    const response = await authApi.login(email.value, password.value);
    failedAttempts.value = 0;

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);

    router.push("/dashboard");
  } catch (error) {
    failedAttempts.value++;

    if (failedAttempts.value >= 3) {
      blockUser();
      authError.value = "Your account is blocked for 1 minute";
    } else {
      authError.value = "Invalid email or password";
    }

    console.error("Login error:", error);
  }
}

onBeforeUnmount(() => {
  if (blockTimer.value) {
    clearInterval(blockTimer.value);
  }
});
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Login
      </h1>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900"
            >Email (min 15 characters)</label
          >

          <div class="mt-2">
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              @input="validateEmail"
              required
              maxlength="50"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <div v-if="emailError">{{ emailError }}</div>
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-900"
            >Password (min 8 characters)</label
          >
          <div class="mt-2">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              @input="validatePassword"
              required
              maxlength="50"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <!-- Checkbox -->
            <div class="flex items-center mt-4">
              <input
                id="toggle-password"
                type="checkbox"
                v-model="showPassword"
                class="shrink-0 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label for="toggle-password" class="ml-2 block text-sm text-gray-700">
                Show password
              </label>
            </div>

            <div v-if="passwordError">{{ passwordError }}</div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            :disabled="isBlocked || !formValid"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ isBlocked ? `Blocked (${remainingTime}s)` : "Login" }}
          </button>
        </div>
      </form>
      <div class="mt-10 text-center text-sm/6 text-gray-500">
        <span>Not registered yet? </span>
        <router-link
          to="/signup"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          >Create an account</router-link
        >
      </div>

      <div v-if="authError" class="error-message">{{ authError }}</div>
    </div>
  </div>
</template>
