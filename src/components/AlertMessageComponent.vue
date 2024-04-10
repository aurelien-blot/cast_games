<template>
  <div v-if="alert!=null" class="alert" :class="[alert.status===true ? 'alert-success' : 'alert-danger']">
    <span>{{alert.message}}</span>
    <span class="fa-pull-right"><button type="button" class="btn-close" @click="onClose()"></button></span>
  </div>
</template>

<script>
export default {
  name: 'AlertMessageComponent',
  props: {
    alert: {
      type: Object,
      required: false
    },
  },
  computed:{
  },
  methods: {
    onClose(){
      this.$emit('update:close', true);
    }
  }
}

</script>

<style scoped>

</style>