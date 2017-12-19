<template>
  <div id="app">
    <photo-gallery
      :show="showDetailView"
      :photos="photos"
      :default-index="selectedImageIndex"
      @on-close="closeDetailView"
    />
    <error :error="error" />

    <div class="title">FusseCam</div>
    <last-photo :photo="lastPhoto" :show="showLastPhoto" />
    <main :class="{'has-last-photo': showLastPhoto }">
      <div class="polaroid">
        <div class="video-container" ref="videoContainer">
          <transition name="fade-scale">
            <div class="video-loader" v-show="!videoReady">
              <img src="./assets/puff.svg" alt="Loading">
            </div>
          </transition>
          <transition name="timer" mode="out-in">
            <div :key="timerSeconds" v-if="showTimer" class="timer">{{ timerSeconds }}</div>
          </transition>
          <video playsinline ref="video"></video>
        </div>
        <div class="date">{{ date }}</div>
      </div>
      <film-strip :photos="photos" @image-selected="selectImage" />
    </main>
    <app-menu
      class="{'has-last-photo': showLastPhoto }"
      @takePhoto="takePhoto"
      @takePhotoWithTimer="takePhotoWithTimer"
      @toggleCamera="toggleCamera"
      @clear="clear"
    />
    <canvas id="paint" ref="canvas"></canvas>
  </div>
</template>

<script>
import PhotoGallery from './PhotoGallery';
import FilmStrip from './FilmStrip';
import LastPhoto from './LastPhoto';
import AppMenu from './AppMenu';
import Error from './Error';
import ImageCapture from './ImageCapture';

export default {
  name: 'app',
  components: {
    PhotoGallery,
    FilmStrip,
    LastPhoto,
    AppMenu,
    Error,
  },
  data() {
    return {
      photos: [],
      front: true,
      lastPhoto: null,
      showLastPhoto: false,
      devices: [],
      stream: null,
      error: null,
      videoReady: false,
      timerSeconds: 3,
      showTimer: false,
      selectedImageIndex: 0,
      showDetailView: false,
      isPortrait: true,
    };
  },
  mounted() {
    this.stream = new ImageCapture(this.$refs.videoContainer, this.$refs.video, this.$refs.canvas);
    window.addEventListener('orientationchange', () => {
      this.stream.setPortrait(screen.orientation.angle === 0);
    });
    this.stream.startCamera()
    .then(() => {
    }).
    catch(err => {
      console.log(err)
    });
  },
  computed: {
    date() {
      const now = new Date();
      return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    },
  },
  methods: {
    takePhoto() {
      const photo = this.stream.takePhoto();
      this.lastPhoto = null;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.createLastPhoto(photo);
      this.photos.unshift(photo);
    },
    takePhotoWithTimer() {
      this.showTimer = true;

      if (this.timer) {
        clearInterval(this.timer);
        this.timerSeconds = 3;
      }
      this.timer = setInterval(() => {
        this.timerSeconds -= 1;
        if (this.timerSeconds === 0) {
          this.showTimer = false;
          clearInterval(this.timer);
          this.timerSeconds = 3;
          setTimeout(() => {
            this.takePhoto();
          }, 1000);
        }
      }, 1000);
    },
    createLastPhoto(data) {
      this.lastPhoto = data;
      this.showLastPhoto = true;
      this.timer = setTimeout(() => {
        this.showLastPhoto = false;
      }, 3000);
      this.timer = setTimeout(() => {
        this.lastPhoto = null;
      }, 3500);
    },
    clear() {
      this.photos = [];
    },
    toggleCamera() {
      this.videoReady = true;
      this.stream.toggleCamera();
    },
    selectImage(index) {
      this.showDetailView = true;
      this.selectedImageIndex = index;
    },
    closeDetailView() {
      this.showDetailView = false;
    },
  },
};
</script>

<style lang="scss">
  $primary-color: linear-gradient(to right top, #2ce795, #00cdc0, #00aedd, #008bdf, #1a62c0);

  ::-webkit-scrollbar { display: none; }

  html,body {
    height: 100%;
  }
  body {
    font-family: sans-serif;
    background: $primary-color;
    margin: 0;
    text-align: center;
    overflow: hidden;
  }
  * {
    box-sizing: border-box;
  }
  .has-last-photo {
    opacity: .5;
  }
  #app {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: opacity .5s;
    background-color: #bbfff9;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='0.11' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-color: rgba(0,0,0,.05);

    @media all and (orientation:landscape) {
      flex-direction: row;
    }
  }

  main {
    flex: 1;
    margin: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    transition: opacity .5s;

    @media all and (orientation:landscape) {
      flex-direction: row;
    }
  }
  .title {
    padding: 10px 10px 20px 10px;
    font-family: 'Exo 2', sans-serif;
    font-size: 40px;
    color: white;
    text-shadow: 0 2px 0 rgba(black, 1);
    letter-spacing: 1px;
    @media all and (orientation:landscape) {
     display: none;
    }
  }

  .polaroid {
    position: relative;
    display: inline-block;
    padding: 8px 8px 0 8px;
    background: white;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4)
  }
  .date {
    font-family: 'Exo 2', sans-serif;
    font-size: 22px;
    padding-top: 0;
    padding-bottom: 5px;
  }
  .video-container {
    position: relative;
    padding-top: 75%;
    width: 50vw;
    overflow: hidden;

    @media all and (orientation:portrait) {
      width: 80vw;
    }
  }
  .video-loader {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }
  video {
    position: absolute;
    @media all and (orientation:portrait) {
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      width: 100%;
      max-width: 90vw;
    }
    @media all and (orientation:landscape) {
      max-height: 90vh;
      top: 0;
      left: 50%;
      height: 100%;
      transform: translate(-50%, 0);
    }

  }

  .timer {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
    color: white;
  }
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
  #paint {
    display: none;
    font-family: 'Exo 2', sans-serif;
  }
  .icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    stroke: currentColor;
  }

  .timer-enter-active, .timer-leave-active {
    transition: transform .2s ease, opacity .2s ease;
  }
  .timer-enter {
    transform: scale(2);
    opacity: 0;
  }
  .timer-leave-to {
    transform: scale(.5);
    opacity: 0;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
</style>
