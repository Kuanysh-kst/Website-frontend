<script setup>
import { useRouter } from "vue-router";

defineProps({
  totalPrice: Number,
});

const emit = defineEmits(["openDrawer"]);

const router = useRouter();

const logout = () => {
  localStorage.removeItem("access_token");
  router.push("/login");
};
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <router-link to="/home"
      ><div class="flex items-center gap-4">
        <img src="/logo.png" alt="Logo" class="w-10" />
        <div>
          <h2 class="text-xl font-bold uppercase">Mr robot</h2>
          <p class="text-slate-500">Магазин доступных компьютеров</p>
        </div>
      </div>
    </router-link>

    <ul class="flex items-center gap-10">
      <li
        class="flex items-center gap-3 text-gray-500 hover:text-black cursor-pointer"
        @click="() => emit('openDrawer')"
      >
        <img src="/cart.svg" alt="Cart" />
        <b>{{ totalPrice }}$</b>
      </li>
      <router-link to="/favorites">
        <li class="flex items-center gap-3 text-gray-500 hover:text-black cursor-pointer">
          <img src="/heart.svg" alt="Cart" />
          <span>Закладки</span>
        </li>
      </router-link>

      <li class="flex items-center gap-3 text-gray-500 hover:text-black cursor-pointer">
        <img src="/profile.svg" alt="Cart" />
        <span>Профиль</span>
      </li>
    </ul>

    <button
      @click="logout"
      class="font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-3 cursor-pointer"
    >
      Logout
    </button>
  </header>
</template>
