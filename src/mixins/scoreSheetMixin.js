import MathService from "@/services/mathService.js";

export default {
    data() {
        return {
        };
    },
    computed: {

    },
    methods: {
        initScoreSheet() {
            let scoreSheet ={};
            this.gameContent.individualScoreSheet.forEach(cell => {
                scoreSheet[cell.key] ={checked : false, value: null};
                if(this.isTestMode && this.testScoreResult===true){
                    if(cell.key!=='CHANCE' && cell.editable===true){
                        scoreSheet[cell.key].value = MathService.getRandomInt(50);
                    }
                }
            });
            return scoreSheet;
        },
        endRoundByCheckScoreCell(){
            this.scoreCellChekDisabled=true;
            let cellKeyChecked = null;
            for(let key in this.activePlayer.scoreSheet){
                if(this.activePlayer.scoreSheet[key].checked===true){
                    cellKeyChecked = key;
                    this.activePlayer.scoreSheet[key].checked = false;
                }
            }
            let result =this.calculateRoundPoints(cellKeyChecked);
            this.activePlayer.scoreSheet[cellKeyChecked].value = result;
            this.activePlayer.score+=result;
        },
        checkScoreSheetCell(cellKey) {
            for(let scoreCheckCell in this.activePlayer.scoreSheet){
                this.activePlayer.scoreSheet[scoreCheckCell].checked=scoreCheckCell===cellKey;
            }
            this.endRoundAction();
        },
    },

}