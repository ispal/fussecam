<template>
  <transition name="timer" mode="out-in">
    <div :key="timerSeconds" class="timer">{{ timerSeconds }}</div>
  </transition>
</template>

<script>
import { wait } from './Wait';

export default {
  name: 'Timer',
  props: {
    duration: {
      type: Number,
      default: 3
    },
    timeLeft: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      timerSeconds: this.duration
    }
  },
  async mounted() {
    await wait(1);
    this.timerSeconds -= 1;
    await wait(1);
    this.timerSeconds -= 1;
    await wait(1);
    this.timerSeconds -= 1;

    this.showTimer = false;
    this.$emit('timerFinished');
    this.timerSeconds = 3;
  }
}
</script>

<style scoped>
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
</style>
