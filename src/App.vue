<template>
  <div id="app">
    <transition name="fade">
      <div class="detail-view" v-show="showDetailView">
        <div class="detail-view__image">
          <img :src="selectedImage" alt="Hall of Fame" />
          <div>
            <a :href="selectedImage" download="hall-of-fame">Download</a> <span @click.stop="share(selectedImage)" v-if="hasShareApi">Share</span>
          </div>
        </div>
        <div class="detail-view__buttons">
          <button class="btn" @click="selectImage(selectedImageIndex-1)" :class="{'is-disabled': !hasPrevImage }" :disabled="!hasPrevImage">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
              <title>arrow_back</title>
              <path d="M20.016 11.016v1.969h-12.188l5.578 5.625-1.406 1.406-8.016-8.016 8.016-8.016 1.406 1.406-5.578 5.625h12.188z"></path>
            </svg>
          </button>
          <button class="btn" @click="selectImage(selectedImageIndex+1)" :class="{'is-disabled': !hasNextImage }" :disabled="!hasNextImage">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
              <title>arrow_forward</title>
              <path d="M12 3.984l8.016 8.016-8.016 8.016-1.406-1.406 5.578-5.625h-12.188v-1.969h12.188l-5.578-5.625z"></path>
            </svg>
          </button>
          <button class="btn" @click="closeDetailView">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
            <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
          </svg>
          </button>
        </div>
      </div>
    </transition>
    <div class="wire"></div>
    <transition name="slide-down">
      <div class="error" v-if="error">
        {{ error.name}}: {{ error.message }}
      </div>
    </transition>

    <div class="title">FusseCam</div>
    <transition name="fade-scale">
      <div class="last-photo" v-if="showLastPhoto">
        <img :src="lastPhoto">
      </div>
    </transition>
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
      <transition-group name="thumbnail" tag="div" class="strip">
        <div v-for="(photo, index) in photos" :key="photo">
          <a href="#" @click.prevent="selectImage(index)">
            <img :src="photo" alt="Hall of Fame" />
          </a>
        </div>
      </transition-group>
    </main>
    <nav :class="{'has-last-photo': showLastPhoto }">
      <button class="btn btn--sm" @click="toggleCamera()" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
          <path d="M18.75 7.734c0.797 1.219 1.266 2.719 1.266 4.266 0 4.406-3.609 8.016-8.016 8.016v3l-3.984-4.031 3.984-3.984v3c3.328 0 6-2.672 6-6 0-1.031-0.281-1.969-0.703-2.813zM12 6c-3.328 0-6 2.672-6 6 0 1.031 0.234 1.969 0.703 2.813l-1.453 1.453c-0.797-1.219-1.266-2.719-1.266-4.266 0-4.406 3.609-8.016 8.016-8.016v-3l3.984 4.031-3.984 3.984v-3z"></path>
        </svg>
      </button>
      <button class="btn" @click="takePhoto()" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
          <path d="M12 17.016c2.766 0 5.016-2.25 5.016-5.016s-2.25-5.016-5.016-5.016-5.016 2.25-5.016 5.016 2.25 5.016 5.016 5.016zM9 2.016h6l1.828 1.969h3.188c1.078 0 1.969 0.938 1.969 2.016v12c0 1.078-0.891 2.016-1.969 2.016h-16.031c-1.078 0-1.969-0.938-1.969-2.016v-12c0-1.078 0.891-2.016 1.969-2.016h3.188zM8.813 12c0-1.781 1.406-3.188 3.188-3.188s3.188 1.406 3.188 3.188-1.406 3.188-3.188 3.188-3.188-1.406-3.188-3.188z"></path>
        </svg>
      </button>
      <button class="btn" @click="takePhotoWithTimer()" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
        3s
      </button>
      <button class="btn btn--sm" @click="clear()" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
          <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
        </svg>
      </button>
    </nav>
    <canvas id="paint" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'app',
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
      selectedImage: null,
      selectedImageIndex: 0,
      showDetailView: false,
      isPortrait: true,
      hasShareApi: false,
    };
  },
  created() {
    window.addEventListener('orientationchange', () => {
      this.isPortrait = screen.orientation.angle === 0;
    });
  },
  mounted() {
    setTimeout(() => {
      this.go();
    }, 200);
  },
  computed: {
    date() {
      const now = new Date();
      return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    },
    hasPrevImage() {
      return this.photos.length > 1 && this.selectedImageIndex > 0;
    },
    hasNextImage() {
      return this.photos.length > 1 && this.selectedImageIndex < this.photos.length - 1;
    },
    constraints() {
      return {
        video: {
          facingMode: this.front ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };
    },
  },
  methods: {
    async go() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        this.$refs.video.srcObject = this.stream;
        this.$refs.video.onloadedmetadata = () => {
          this.videoReady = true;
          this.$refs.video.play();
        };
      } catch (err) {
        this.error = err;
        setTimeout(() => {
          this.error = null;
        }, 3000);
      }
    },
    drawImage() {
      const margin = 40;
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');

      if (this.isPortrait) {
        const cropPercentage =
          this.$refs.videoContainer.clientHeight / this.$refs.video.clientHeight;
        const cropAmount = (video.videoHeight - (video.videoHeight * cropPercentage)) / 2;
        const croppedHeight = (video.videoHeight - (cropAmount * 2));

        canvas.width = video.videoWidth + (margin * 2);
        canvas.height = croppedHeight + (margin * 2) + 80;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          video, 0, cropAmount, video.videoWidth, croppedHeight,
          margin, margin, video.videoWidth, croppedHeight,
        );
      } else {
        const cropPercentage = this.$refs.videoContainer.clientWidth / this.$refs.video.clientWidth;
        const cropAmount = (video.videoWidth - (video.videoWidth * cropPercentage)) / 2;
        const croppedWidth = (video.videoWidth - (cropAmount * 2));

        canvas.width = croppedWidth + (margin * 2);
        canvas.height = video.videoHeight + (margin * 2) + 80;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#dddddd';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          video, cropAmount, 0, croppedWidth, video.videoHeight,
          margin, margin, croppedWidth, video.videoHeight,
        );
      }

      ctx.textAlign = 'center';
      ctx.font = '700 80px "Exo 2"';
      ctx.fillStyle = '#000000';
      ctx.fillText(this.date, canvas.width / 2, canvas.height - 30);

      return canvas;
    },
    takePhoto() {
      const image = this.drawImage();
      const data = image.toDataURL('image/jpeg', 1);

      this.lastPhoto = null;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.createLastPhoto(data);
      this.photos.unshift(data);
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
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });

      this.videoReady = true;
      this.front = !this.front;
      this.go();
    },
    selectImage(index) {
      this.showDetailView = true;
      this.selectedImage = this.photos[index];
      this.selectedImageIndex = index;
    },
    closeDetailView() {
      this.showDetailView = false;
      this.selectedImage = null;
    },
    share(imageData) {
      navigator.share({
        title: 'Foosballe Hall of Fame',
        text: '',
        url: imageData,
      })
      .then(() => console.log('Successful share'))
      .catch((err) => {
        this.error = err;
        setTimeout(() => {
          this.error = null;
        }, 3000);
      });
    },
    touchStart(evt) {
      evt.currentTarget.classList.add('pressed');
    },
    touchEnd(evt) {
      evt.currentTarget.classList.remove('pressed');
    },
  },
};
</script>

<style lang="scss">
  $primary-color: linear-gradient(to top, #ef4a8d, #ef5d97, #ef6da1, #ef7daa, #ee8bb3);

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

    @media all and (orientation:landscape) {
      flex-direction: row;
    }
  }
  .detail-view {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $primary-color;
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
  .wire {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(white, .2);
    mask: url('./assets/wire.svg') no-repeat 50% 50% / 400% 400%;
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
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    width: 80px;
    height: 80px;
    color: white;
    background: black;
    border: 0;
    border-radius: 50%;
    outline: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6);
    transition: transform .15s ease-out, opacity .4s;

    &--sm {
      width: 50px;
      height: 50px;
      font-size: 22px;
    }

    &.is-disabled {
      opacity: .5;
    }

    &.pressed {
      transform: scale(1.1);
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

  @keyframes flash {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
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
  .fade-scale-leave-active {
    transition: transform .25s,  opacity .25s;
  }
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(3);
  }
  .slide-down-enter-active, .slide-down-leave-active {
    transition: transform .25s;
  }
  .slide-down-enter, .slide-down-leave-to {
    transform: translate(0, -100%);
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
