<template>
  <div class="modal-overlay"></div>
  <div class="modal custom-modal" :class="customClass">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
          <button type="button" class="btn-close" :disabled="!canClose" @click="onClose()"></button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
          <button type="button" class="btn btn-secondary"
                  :disabled="!canClose" @click="onClose()">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicModalComponent',
  props:{
    onClose: {
      type: Function,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    customClass:{
      type: String,
      required: false
    },
    canClose: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>

<style>
.custom-modal{
  display: block !important;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1040; /* Assurez-vous que cet indice est inférieur à celui de la modale pour que la modale apparaisse au-dessus. */
}
</style>
