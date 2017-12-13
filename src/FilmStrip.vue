<template>
  <transition-group name="thumbnail" tag="div" class="strip">
    <div v-for="(photo, index) in photos" :key="photo">
      <a href="#" @click.prevent="selectImage(index)">
        <img :src="photo" alt="Hall of Fame" />
      </a>
    </div>
  </transition-group>
</template>

<script>
  export default {
    name: 'FilmStrip',
    props: {
      photos: Array,
    },
    methods: {
      selectImage(index) {
        this.$emit('image-selected', index);
      },
    },
  };
</script>

<style lang="scss" scoped>
.strip {
  width: 100%;
  height: 100%;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;

  @media all and (orientation:landscape) {
    height: 100%;
    margin-left: 20px;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: initial;
    align-items: flex-start;
  }
}
.strip a {
  display: block;
}
.strip div:nth-child(2n+1) a {
  transform: rotate(10deg)
}
.strip div:nth-child(2n+2) a {
  transform: rotate(-10deg)
}
.strip img {
  width: 100px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media all and (orientation:landscape) {
    width: 100%;
  }
}
.thumbnail-enter-active, .thumbnail-leave-active {
  transition: all .3s;
}
.thumbnail-move {
  transition: all .3s;
}
.thumbnail-enter, .thumbnail-leave-to {
  opacity: 0;
  transform: scale(.5);
}
</style>
