<template>
  <div v-if="error">
    <div class='error-container'>
      <p class="body-2 red--text" >{{error.message}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'apiError',
  props: {
    error: null
  },
  data: () => ({})
};
</script>

<style lang="scss">
.error-container{
  padding: .5rem 1rem;
  text-align: center;
}
</style>
