<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import axios from "axios";

import DashboardHeader from "@/components/DashboardHeader.vue";
import ProductCardList from "@/components/ProductCardList.vue";

const items = ref([]);

const filters = reactive({
  sortBy: "title",
  searchQuery: "",
});

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value;
};

const fetchFavorites = async () => {
  try {
    const token = localStorage.getItem("const_token");
    console.log("token", token);
    const { data: favorites } = await axios.get(`http://localhost:8080/api/favorites`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      withCredentials: true, // если используешь куки, иначе можно опустить
    });

    items.value = items.value.map((item) => {
      const favoriteItem = favorites.find((favorite) => favorite.productId === item.id);

      if (!favoriteItem) {
        return {
          ...item,
          isFavorite: false,
          favoritesId: null,
          favoriteProductId: null,
        };
      }

      return {
        ...item,
        isFavorite: true,
        favoritesId: favoriteItem.id,
        favoriteProductId: favoriteItem.productId,
      };
    });

    console.log(items.value);
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
};

const fetchItems = async () => {
  try {
    const params = {
      sort: filters.sortBy,
    };

    if (filters.searchQuery) {
      params.title = `${filters.searchQuery}`;
    }

    const { data } = await axios.get(
      `http://localhost:8080/api/products/all?page=0&size=100`,
      {
        params,
      }
    );
    items.value = data.content.map((obj) => ({
      ...obj,
      isFavorite: false,
      isAdded: false,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(async () => {
  await fetchItems();
  await fetchFavorites();
});

watch(filters, fetchItems);
</script>

<template>
  <!-- <Drawer /> -->
  <DashboardHeader />

  <div class="p-10">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold mb-8">Весь Товар</h2>
      <div class="flex gap-4">
        <select
          @change="onChangeSelect"
          class="py-2 px-3 border rounded-md outline-none"
          name=""
          id=""
        >
          <option value="title">По названию</option>
          <option value="price,asc">По цене (по возрастанию)</option>
          <option value="price,desc">По цене (по убыванию)</option>
        </select>
        <div class="relative">
          <img class="absolute left-4 top-3" src="/search.svg" alt="" />
          <input
            @input="onChangeSearchInput"
            type="text"
            class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
            placeholder="Поиск..."
          />
        </div>
      </div>
    </div>

    <div class="mt-10">
      <ProductCardList :items="items" />
    </div>
  </div>
</template>
