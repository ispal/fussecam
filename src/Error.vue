<template>
  <transition name="slide-down">
    <div class="error" v-if="error">
      {{ error.name}}: {{ error.message }}
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Error',
    props: {
      error: Object,
    },
  };
</script>

<style lang="scss" scoped>
.error {
  z-index: 20;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 10px;
  padding: 15px;
  color: white;
  background: #FF596D;
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: transform .25s;
}
.slide-down-enter, .slide-down-leave-to {
  transform: translate(0, -100%);
}
</style>
