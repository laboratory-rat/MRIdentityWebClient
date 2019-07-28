<template>
  <div class="sc--container">
    <div class="text-xs-center loader--container" v-if="visible">
      <v-progress-circular
        v-if="type == 'spinner'"
        :color="color"
        indeterminate
        :size="size"
        :width="width"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
export default {
  name: "spinnerComponent",
  props: {
    size: {
      type: Number,
      default: 50
    },
    width: {
      type: Number,
      default: 4
    },
    visible: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: "primary"
    },
    type: {
      type: String,
      default: "spinner",
      validator: value => ["spinner", "linear"].indexOf(value) !== -1
    }
  }
};
</script>

<style lang="scss" scope>
.sc--container {
  width: 100%;
  display: block;
  .loader--container {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
