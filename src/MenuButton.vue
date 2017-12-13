<template>
  <button @click="onClick" :class="`btn btn--${size}`" @touchstart="touchStart($event)" @touchend="touchEnd($event)">
    <slot />
  </button>
</template>

<script>
  export default {
    name: 'MenuButton',
    props: {
      size: {
        type: String,
        default: '',
      },
    },
    methods: {
      onClick() {
        this.$emit('click');
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

<style lang="scss" scoped>
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
</style>
