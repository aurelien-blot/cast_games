export default {
    data() {
        return {
        };
    },
    computed: {

    },
    methods: {
        calculateRoundPoints(element){
            switch (this.activePlayer.currentRound.currentAction.type) {
                case "CHECK_SCORE_CELL":
                    return this.calculateScoreCellChecked(element);
                    break;
                case "SELECT_DICE":
                    //Déjà calculé
                    break;
                default:
                    return 0;
            }
        },
        calculateRoundActionPoints(selectedDiceList){
            switch (this.activePlayer.currentRound.currentAction.type) {
                case "SELECT_DICE":
                    return this.calculateSelectedDiceScore(selectedDiceList);
                    break;
                default:
                    return 0;
            }
        },
        calculateScoreCellChecked(cellKeyChecked){
            if(cellKeyChecked!=null) {
                switch (cellKeyChecked) {
                    case "TOTAL_1":
                        return this.calculateSumOfDices(1);
                    case "TOTAL_2":
                        return this.calculateSumOfDices(2);
                    case "TOTAL_3":
                        return this.calculateSumOfDices(3);
                    case "TOTAL_4":
                        return this.calculateSumOfDices(4);
                    case "TOTAL_5":
                        return this.calculateSumOfDices(5);
                    case "TOTAL_6":
                        return this.calculateSumOfDices(6);
                    case "BRELAN":
                        return this.calculateCombinaison(3);
                    case "CARRE":
                        return this.calculateCombinaison(4);
                    case "FULL":
                        return this.calculateFull();
                    case "SMALL_STRAIGHT":
                        return this.calculatePetiteSuite();
                    case "LARGE_STRAIGHT":
                        return this.calculateGrandeSuite();
                    case "YAMS":
                        return this.calculateCombinaison(5);
                    case "CHANCE":
                        return this.activeDiceResult.reduce((a, b) => a + b, 0);
                    default:
                        return 0;
                }
            }
            return 0;
        },
        calculateSelectedDiceScore(selectedDice){
            let selectedDiceValue = selectedDice.map(dice => dice.value);
            let score=0;
            let isGrandeSuite = this.calculateDicePossibility(selectedDiceValue, [1,2,3,4,5,6]);
            if(isGrandeSuite){
                return 1500;
            }
            let isPetiteSuiteSup = this.calculateDicePossibility(selectedDiceValue, [2,3,4,5,6]);
            let isPetiteSuiteInf = this.calculateDicePossibility(selectedDiceValue, [1,2,3,4,5]);
            if(isPetiteSuiteSup || isPetiteSuiteInf){
                if(isPetiteSuiteSup){
                    score+=750;
                }
                else if(isPetiteSuiteInf){
                    score+=500;
                }
                if(selectedDice.filter(dice => dice.value === 1).length===2){
                    score+=100;
                }
                else if(selectedDice.filter(dice => dice.value === 5).length===2){
                    score+=50;
                }
            }
            else{
                for(let i=1;i<6+1;i++){
                    let diceScore =0;
                    let total = selectedDice.filter(dice => dice.value === i);
                    if(total.length>0){
                        if(i===1 && total.length < 3) {
                            diceScore = total.length * 100;
                        }
                        else if(i===5 && total.length < 3){
                            if (total.length < 3) {
                                diceScore = total.length * 50;
                            }
                        }
                        else if(total.length>=3){
                            if(i===1){
                                diceScore=1000;
                            }
                            else{
                                diceScore=100*i;
                            }
                            let exposant = total.length-3;
                            if(exposant>0){
                                diceScore*=Math.pow(2,exposant);
                            }
                        }
                    }
                    score+=diceScore;
                }
            }
            return score;
        },
        calculateCombinaison(diceValue) {
            for(let i = 1; i <= 6; i++) {
                if(this.activeDiceResult.filter(dice => dice.value === i).length >= diceValue) {
                    return this.calculateSumOfDices(i);
                }
            }
            return 0;
        },
        calculateFull() {
            let brelanValue=null;
            let pairValue=null;
            for(let i = 1; i <= 6; i++) {
                if(this.activeDiceResult.filter(dice => dice.value === i).length === 3) {
                    brelanValue = i;
                }
                else if(this.activeDiceResult.filter(dice => dice.value === i).length === 2) {
                    pairValue = i;
                }
            }
            if(brelanValue!=null && pairValue!=null) {
                return 25;
            }
            return 0;
        },
        calculatePetiteSuite() {
            return this.calculatePossibilities([[1,2,3,4],[2,3,4,5],[3,4,5,6]], 30);
        },
        calculateGrandeSuite() {
            return this.calculatePossibilities([[1,2,3,4,5],[2,3,4,5,6]], 40);
        },
        calculatePossibilities(possibilities, score) {
            let result=0;
            if(this.calculateDicePossibilities(this.activeDiceResult, possibilities)){
                result=score;
            }
            return result;
        },
    },

}