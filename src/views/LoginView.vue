    <template>
        <div class="login-view">
            <div class="login-container">
                <h1>Login</h1>
                <form @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            v-model="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            v-model="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" class="login-button">Login</button>
                </form>
            </div>
        </div>
    </template>

<script>
import authApi from '@/api/auth'
import { useRouter } from 'vue-router'

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await authApi.login(this.email, this.password)
        
        // Сохраняем токен
        localStorage.setItem('jwtToken', response.data.token)
        
        // Перенаправляем на защищенную страницу
        this.$router.push('/hello')
        
      } catch (error) {
        this.error = "Invalid credentials"
        console.error("Login error:", error)
      }
    },
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


    .login-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
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
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
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
    }

    .login-button:hover {
        background-color: #0056b3;
    }
    </style>