<template>
  <BasicModalComponent
      :title="title?title:'Avertissement'"
      :on-close="onClose">
    <template v-slot:body>
      <p>{{content}}</p>
    </template>
    <template v-slot:footer>
    </template>
  </BasicModalComponent>
</template>
<script >
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
export default {
  name: 'WarningModalComponent',
  components: {BasicModalComponent},
  props: {
    onClose: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped>

</style>