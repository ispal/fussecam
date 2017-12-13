<template>
  <transition name="fade-scale">
    <div class="last-photo" v-if="show">
      <img :src="photo">
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'LastPhoto',
    props: {
      show: false,
      photo: String,
    },
  };
</script>

<style lang="scss" scoped>
.last-photo {
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    z-index: 3;
    position: relative;
    width: 90%;
    height: 90%;
    object-fit: contain;
  }

  &:after {
    z-index: 4;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    animation: flash .7s forwards;
  }

}

.fade-scale-leave-active {
  transition: transform .25s,  opacity .25s;
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(3);
}
@keyframes flash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
