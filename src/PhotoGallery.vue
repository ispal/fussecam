<template>
  <transition name="fade">
    <div class="photo-gallery" v-show="show">
      <div class="photo-gallery__image">
        <img :src="selectedImage" alt="Hall of Fame" />
        <div>
          <a :href="selectedImage" download="hall-of-fame">Download</a> <span @click.stop="share(selectedImage)" v-if="hasShareApi">Share</span>
        </div>
      </div>
      <div class="photo-gallery__buttons">
        <menu-button @click="selectImage(selectedImageIndex-1)" :class="{'is-disabled': !hasPrevImage }" :disabled="!hasPrevImage">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
            <title>arrow_back</title>
            <path d="M20.016 11.016v1.969h-12.188l5.578 5.625-1.406 1.406-8.016-8.016 8.016-8.016 1.406 1.406-5.578 5.625h12.188z"></path>
          </svg>
        </menu-button>
        <menu-button @click="selectImage(selectedImageIndex+1)" :class="{'is-disabled': !hasNextImage }" :disabled="!hasNextImage">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
            <title>arrow_forward</title>
            <path d="M12 3.984l8.016 8.016-8.016 8.016-1.406-1.406 5.578-5.625h-12.188v-1.969h12.188l-5.578-5.625z"></path>
          </svg>
        </menu-button>
        <menu-button @click="closeDetailView">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
          <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
        </svg>
        </menu-button>
      </div>
    </div>
  </transition>
</template>

<script>
import MenuButton from './MenuButton';

export default {
  name: 'PhotoGallery',
  components: {
    MenuButton,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    photos: Array,
    defaultIndex: Number,
  },
  data() {
    return {
      selectedImageIndex: this.defaultIndex,
      hasShareApi: false,
    };
  },
  computed: {
    hasPrevImage() {
      return this.photos.length > 1 && this.selectedImageIndex > 0;
    },
    hasNextImage() {
      return this.photos.length > 1 && this.selectedImageIndex < this.photos.length - 1;
    },
    selectedImage() {
      return this.photos[this.selectedImageIndex];
    },
  },
  methods: {
    selectImage(index) {
      this.selectedImageIndex = index;
    },
    closeDetailView() {
      this.$emit('on-close');
    },
    share(imageData) {
      navigator.share({
        title: 'Foosball Hall of Fame',
        text: '',
        url: imageData,
      })
      .catch((err) => {
        this.error = err;
        setTimeout(() => {
          this.error = null;
        }, 3000);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.photo-gallery {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: black;
  display: flex;
  flex-direction: column;

  @media all and (orientation:landscape) {
    flex-direction: row;
  }

  &__image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    flex: 1;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: white;
    font-weight: 300;

    @media all and (orientation:landscape) {
      max-width: 85%;
    }

    a, span {
      margin-top: 10px;
      display: inline-block;
      background: black;
      border-radius: 25px;
      padding: 10px 20px;
      text-decoration: none;
      color: #fff;
    }
  }
  img {
    width: 100%;
    object-fit: contain;

    @media all and (orientation:landscape) {
      width: 85%;
      height: 85%;
    }
  }

  &__buttons {
    display: flex;
    padding: 15px;
    align-items: center;
    justify-content: space-around;

    @media all and (orientation:landscape) {
      flex-direction: column;
    }
  }

}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
