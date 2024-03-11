<template>
  <div class="row"  v-if="diceResultList!=null && diceResultList.length>0">
    <div class="text-center">
      <div v-for="(dice, index) in diceList" :key="index"
           @click="selectDice(dice)"
           class="dice-result" >
        <font-awesome-icon :icon="getDiceFont(dice.value)" :class="dice.selected?'selected-dice':dice.selectable?'selectable-dice':''"/>
      </div>
    </div>
  </div>
  <div class="col-12 text-center" v-if="throwingEnabled">
    <button class="btn btn-success btn-md" @click="throwDiceFct()"><font-awesome-icon icon="fa-solid fa-dice"/></button>
  </div>
</template>
<script >
export default {
  name: 'DiceAreaComponent',
  props: {
    diceResultList: {
      type: Array,
      required: true
    },
    throwingEnabled: {
      type: Boolean,
      required: true
    },
    onThrowDiceFct: {
      type: Function,
      required: false
    },
    selectableValues: {
      type: Array,
      required: false
    },
    onSelectedDice: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      diceList :[]
    }
  },
  methods: {
    initDiceList() {
      this.diceList = [];
      if(this.diceResultList==null || this.diceResultList.length===0){
        return;
      }
      for (let i = 0; i < this.diceResultList.length; i++) {
        this.diceList.push({value: this.diceResultList[i].value, selectable: this.isSelectableValue(this.diceResultList[i].value), selected: this.diceResultList[i].selected});
      }
    },
    getDiceFont(dice) {
      let result = "fa-dice";
      switch (dice) {
        case 1:
          result += "-one";
          break;
        case 2:
          result += "-two";
          break;
        case 3:
          result += "-three";
          break;
        case 4:
          result += "-four";
          break;
        case 5:
          result += "-five";
          break;
        case 6:
          result += "-six";
          break;
        default:
          result += "";
      }
      return "fa-solid "+result;
    },
    throwDiceFct() {
      this.onThrowDiceFct();
    },
    isSelectableValue(dice) {
      return this.selectableValues!=null && this.selectableValues.includes(dice);
    },
    selectDice(dice) {
      if(dice.selectable){
        dice.selected = !dice.selected;
        if(this.onSelectedDice!=null){
          this.onSelectedDice(this.diceList);
        }
        /*full straight 1-6 is worth 1500 points.
            partial straight 1-5 is worth 500 points.
            partial straight 2-6 is worth 750 points.*/
      }
    }
  },
  mounted() {
    this.initDiceList();
  }
}

</script>

<style scoped>
.dice-result {
  font-size: 2rem;
  margin-left: 8px;
  margin-right: 8px;
  display: inline-block;
  justify-content: space-around;

}
.selected-dice {
  cursor: pointer;
  padding: 4px;
  background-color: green;
  border-radius: 5px;
}
.selectable-dice {
  cursor: pointer;
}
</style>