import MathService from "@/services/mathService.js";

export default {
    data() {
        return {
            activeDiceResult: null,
            testDiceResult: [],
        };
    },
    computed: {

    },
    methods: {
        calculateSumOfDices(diceValue) {
            return this.activeDiceResult.filter(dice => dice.value === diceValue).length * diceValue;
        },
        cleanDiceResult() {
            let diceList = [];
            for (let i = 0; i < this.activePlayer.currentRound.currentAction.remainingDiceTotal; i++) {
                diceList.push({value: 0, selected: false});
            }
            if(this.activeDiceResult!=null){
                for(let i = 0; i < diceList.length; i++) {
                    if(this.activeDiceResult[i]!==undefined && this.activeDiceResult[i].selected){
                        diceList[i]=this.activeDiceResult[i];
                    }
                }
            }
            this.activeDiceResult = diceList;
        },
        calculateDicePossibility(diceList, possibility){

            return this.calculateDicePossibilities(diceList, [possibility]);
        },
        calculateDicePossibilities(diceList, possibilities){
            let diceValueList = diceList.map(dice => dice.value);
            let sortedDice = diceValueList.sort((a, b) => a - b);
            return possibilities.some(possibility => {
                let possibilityExist = true;
                for(let i = 0; i < possibility.length; i++) {
                    if(!sortedDice.includes(possibility[i])) {
                        possibilityExist = false;
                        break; // Sortie immédiate de la boucle for si une désincompatibilité est trouvée
                    }
                }
                return possibilityExist; // Retourne true pour arrêter some si une possibilité correspond
            });
        },
        throw1D6Dice() {
            return this.throwDice(6);
        },
        throwDice(max) {
            return Math.floor(MathService.getRandomInt(max)) + 1;
        },
        throwAllDices() {
            let diceList = [];
            for(let i = 0; i < this.activePlayer.currentRound.currentAction.remainingDiceTotal; i++) {
                if(this.activeDiceResult[i]!==undefined && this.activeDiceResult[i].selected){
                    diceList[i]=this.activeDiceResult[i];
                }
                else{
                    diceList[i]={value :this.throw1D6Dice(), selected:false};
                }
            }
            this.activeDiceResult = diceList;
            this.activeDiceResult.sort((a, b) => a.value - b.value);
            if(this.isTestMode && this.testDiceResult!=null && this.testDiceResult.length>=5){
                this.activeDiceResult= [];
                this.testDiceResult.forEach(dice=>this.activeDiceResult.push({value:dice.value, selected:false}))
            }
        },
        checkSelectableDice() {
            let selectableDices = [];
            let grandeSuite = this.calculateDicePossibility(this.activeDiceResult, [1,2,3,4,5,6]);
            if(grandeSuite){
                return this.activeDiceResult;
            }
            let petiteSuiteInf = this.calculateDicePossibility(this.activeDiceResult, [1,2,3,4,5]);
            if(petiteSuiteInf){
                selectableDices.push(1,2,3,4,5);
            }
            let petiteSuiteSup = this.calculateDicePossibility(this.activeDiceResult, [2,3,4,5,6]);
            if(petiteSuiteSup){
                selectableDices.push(2,3,4,5,6);
            }
            let diceValueList = this.activeDiceResult.map(dice => dice.value);
            if(diceValueList.includes(1) && !selectableDices.includes(1)){
                selectableDices.push(1);
            }
            if(diceValueList.includes(5) && !selectableDices.includes(5)){
                selectableDices.push(5);
            }
            for(let i = 0; i < 6; i++) {
                if(!selectableDices.includes(i+1) && diceValueList.filter(dice => dice === i+1).length >= 3) {
                    selectableDices.push(i+1);
                }
            }
            return selectableDices;
        },
        selectDice(diceList){
            let selectedDiceList = [];
            for(let i = 0; i < diceList.length; i++) {
                let dice = diceList[i];
                this.activeDiceResult[i].selected = dice.selected;
                if(dice.selected){
                    selectedDiceList.push(dice);
                }
            }
            this.activePlayer.currentRound.currentAction.selectedDiceList = selectedDiceList;
            this.activePlayer.currentRound.currentAction.done= this.canActionContinue(this.activePlayer.currentRound.currentAction.selectedDiceList);
            this.activePlayer.currentRound.currentAction.score=this.calculateRoundActionPoints(this.activePlayer.currentRound.currentAction.selectedDiceList);
        },
        throwAllDicesAndEndAction() {
            this.throwAllDices();
            this.endRoundAction();
        },
        calculateRemainingDiceTotal(){
            let remainingDice = this.activePlayer.currentRound.remainingDiceTotal - this.activePlayer.currentRound.currentAction.selectedDiceList.length;
            if(remainingDice>0){
                return remainingDice;
            }
            else{
                return this.activePlayer.currentRound.currentAction.diceTotal;
            }
        },
        canActionContinue(selectedDiceList){
            let diceValueList = selectedDiceList.map(dice => dice.value);
            //Si on a petite suite, on peut continuer
            if(selectedDiceList.length===6){
                let suites = this.calculateDicePossibility(diceValueList, [[1,2,3,4,5], [2,3,4,5,6], [1,2,3,4,5,6]]);
                if(suites){
                    return true;
                }
            }
            for(let i=1; i<=6; i++){
                if(i!==1 && i!==5){
                    let total = selectedDiceList.filter(dice => dice.value===i);
                    if(total.length>0 && total.length<3){
                        return false;
                    }
                }
            }
            return true;
        },
    },

}