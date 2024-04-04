<template>
  <BasicModalComponent
      :title="title?title:'Suppression'"
      :can-close="canClose"
      :on-close="onClose">
    <template v-slot:body>
      <slot name="modalContent"></slot>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-danger"
              :disabled="!canDelete" @click="deleteItem">Supprimer</button>
    </template>
  </BasicModalComponent>
</template>
<script >
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
export default {
  name: 'DeleteModalComponent',
  components: {BasicModalComponent},
  props: {
    onClose: {
      type: Function,
      required: true
    },
    onDelete: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    canDelete: {
      type: Boolean,
      required: false,
      default: true
    },
    canClose: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    deleteItem() {
      this.onDelete();
    }
  },
}
</script>

<style scoped>

</style>