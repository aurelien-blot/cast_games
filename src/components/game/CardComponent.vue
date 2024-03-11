<template>
  <div class="card">
    <span class="main-label">{{label}}</span>
  </div>

</template>
<script >
export default {
  name: 'CardComponent',
  props: {
    label: {
      type: String,
      required: false
    },


  },
  data() {
    return {
    }
  },
}

</script>

<style scoped>
.card{
  background-color: #f3f3f3;
  padding: 10px;
  border-radius: 5px;
  height: 150px;
  width: 100px;
  border: 1px solid black;
}

.main-label{
  margin-top: 50px;
  color: black;
  font-size: 0.8rem;
  text-align: center;
}
</style>
