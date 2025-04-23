<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import PasswordToggle from "@/components/PasswordToggle.vue";
import authApi from "@/api/auth";

const router = useRouter();

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "ROLE_USER",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errors = reactive({
  firstName: [],
  lastName: [],
  email: [],
  password: [],
  confirmPassword: [],
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const isFormValid = computed(() => {
  return (
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirmPassword.trim() &&
    form.password === form.confirmPassword
  );
});

function validatePasswordMatch() {
  errors.confirmPassword = [];
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    errors.confirmPassword.push("Passwords do not match");
  }
}

async function handleRegister() {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  validatePasswordMatch();

  try {
    const response = await authApi.signup({
      firstname: form.firstName,
      lastname: form.lastName,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    successMessage.value = "Registration successful! Redirecting...";
    localStorage.setItem("jwtToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("userEmail", form.email);

    setTimeout(() => router.push("/verify"), 2000);
  } catch (err) {
    if (err.response?.data?.messages) {
      const backendErrors = err.response.data.messages;
      for (const key in errors) {
        errors[key] = backendErrors[key.toLowerCase()] || [];
      }
    } else {
      errorMessage.value = "Registration failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <h1 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
      Create Account
    </h1>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleRegister">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block text-sm/6 font-medium text-gray-900"
            >First Name</label
          >
          <div class="mt-2">
            <input
              type="text"
              id="firstName"
              v-model="form.firstName"
              required
              maxlength="50"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <div v-if="errors.firstName.length" class="error-message">
              <ul>
                <li v-for="err in errors.firstName" :key="err">{{ err }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="block text-sm/6 font-medium text-gray-900"
            >Last Name</label
          >
          <div class="mt-2">
            <input
              type="text"
              id="lastName"
              v-model="form.lastName"
              required
              maxlength="50"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <div v-if="errors.lastName.length" class="error-message">
              <ul>
                <li v-for="err in errors.lastName" :key="err">{{ err }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            maxlength="50"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <div v-if="errors.email.length" class="error-message">
            <ul>
              <li v-for="err in errors.email" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-900"
            >Password</label
          >
          <div class="mt-2">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
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
          </div>
          <div v-if="errors.password.length" class="error-message">
            <ul>
              <li v-for="err in errors.password" :key="err">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900"
            >Confirm Password</label
          >
          <div class="mt-2">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="form.confirmPassword"
              required
              maxlength="50"
              @input="validatePasswordMatch"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <!-- Checkbox -->
            <div class="flex items-center mt-4">
              <input
                id="toggle-password"
                type="checkbox"
                v-model="showConfirmPassword"
                class="shrink-0 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label for="toggle-password" class="ml-2 block text-sm text-gray-700">
                Show confirm password
              </label>
            </div>

            <div v-if="errors.confirmPassword.length" class="error-message">
              <ul>
                <li v-for="err in errors.confirmPassword" :key="err">{{ err }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ loading ? "Processing..." : "Register" }}
          </button>
          <div v-if="successMessage.value" class="success-message">
            {{ successMessage.value }}
          </div>
          <div v-if="errorMessage.value" class="error-message">
            {{ errorMessage.value }}
          </div>
        </div>

        <!-- Already have an account? -->
        <div class="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?
          <router-link
            to="/login"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
            >Sign in</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>
