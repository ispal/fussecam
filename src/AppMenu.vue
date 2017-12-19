<template>
  <nav>
    <menu-button @click="toggleCamera()" size="sm">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
        <path d="M18.75 7.734c0.797 1.219 1.266 2.719 1.266 4.266 0 4.406-3.609 8.016-8.016 8.016v3l-3.984-4.031 3.984-3.984v3c3.328 0 6-2.672 6-6 0-1.031-0.281-1.969-0.703-2.813zM12 6c-3.328 0-6 2.672-6 6 0 1.031 0.234 1.969 0.703 2.813l-1.453 1.453c-0.797-1.219-1.266-2.719-1.266-4.266 0-4.406 3.609-8.016 8.016-8.016v-3l3.984 4.031-3.984 3.984v-3z"></path>
      </svg>
    </menu-button>
    <menu-button @click="takePhoto()">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
        <path d="M12 17.016c2.766 0 5.016-2.25 5.016-5.016s-2.25-5.016-5.016-5.016-5.016 2.25-5.016 5.016 2.25 5.016 5.016 5.016zM9 2.016h6l1.828 1.969h3.188c1.078 0 1.969 0.938 1.969 2.016v12c0 1.078-0.891 2.016-1.969 2.016h-16.031c-1.078 0-1.969-0.938-1.969-2.016v-12c0-1.078 0.891-2.016 1.969-2.016h3.188zM8.813 12c0-1.781 1.406-3.188 3.188-3.188s3.188 1.406 3.188 3.188-1.406 3.188-3.188 3.188-3.188-1.406-3.188-3.188z"></path>
      </svg>
    </menu-button>
    <menu-button @click="takePhotoWithTimer()">
      3s
    </menu-button>
    <menu-button @click="clear()" size="sm">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
        <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
      </svg>
    </menu-button>
  </nav>
</template>

<script>
import MenuButton from './MenuButton';

export default {
  name: 'AppMenu',
  components: {
    MenuButton,
  },
  methods: {
    takePhoto() {
      this.$emit('takePhoto');
    },
    toggleCamera() {
      this.$emit('toggleCamera');
    },
    takePhotoWithTimer() {
      this.$emit('takePhotoWithTimer');
    },
    clear() {
      this.$emit('clear');
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: opacity .5s;

  @media all and (orientation:landscape) {
    flex-direction: column;
  }
}
</style>
