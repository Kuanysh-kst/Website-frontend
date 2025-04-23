<template>
    <span class="toggle-password" @click="$emit('toggle')">
      <i :class="show ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </span>
  </template>
  
  <script>
  export default {
    name: "PasswordToggle",
    props: {
      show: {
        type: Boolean,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .toggle-password {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0.75rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #007bff;
    font-size: 1.25rem;
  }
  .toggle-password:hover {
    color: #0056b3;
  }
  </style>
  