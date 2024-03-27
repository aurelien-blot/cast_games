<template>
  <div class="row">
    <div class="col-12">
      <div class="row tab-area-title" @click="toggleAccordion">
        <div class="col-11">{{title}}</div>
        <div class="col-1">
          <font-awesome-icon v-if="isOpen" icon="fa-solid fa-chevron-down" />
          <font-awesome-icon v-else icon="fa-solid fa-chevron-up" />
        </div>

      </div>
      <div v-if="isOpen" class="row tab-area-content">
        <slot name="tab-area-content"></slot>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  name: 'TabAreaComponent',
  props:{
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    }
  }
}

</script>

<style scoped>
.tab-area-title {
  font-weight: bold;
  cursor: pointer;
}
.tab-area-content {
  transition: all 0.2s ease;
}
</style>