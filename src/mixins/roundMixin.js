export default {
    data() {
        return {
        };
    },
    computed: {
        isCurrentRound(){
            return this.activePlayer!=null &&this.activePlayer.currentRound!=null;
        },
        isCurrentRoundAction(){
            return this.isCurrentRound && this.activePlayer.currentRound.currentAction!=null;
        },
        isCurrentRoundActionInstruction(){
            return this.isCurrentRoundAction && this.activePlayer.currentRound.currentAction.instruction!=null;
        },
        isCurrentRoundActionDone(){
            return this.isCurrentRoundAction && this.activePlayer.currentRound.currentAction.done;
        },
        isCurrentRoundActionFinished(){
            return this.isCurrentRoundAction && this.activePlayer.currentRound.currentAction.finished;
        },
        showEndRoundButton() {
            switch (this.currentActionType) {
                case "CHECK_SCORE_CELL":
                    return this.scoreSheetCellChecked;
                case "SELECT_DICE":
                    return true;
                default:
                    return false;
            }
        },
        actionIsRollDice() {
            return this.isCurrentRoundAction && this.activePlayer.currentRound.currentAction.type === 'ROLL_DICE';
        },
        actionIsCheckScoreCell() {
            return this.isCurrentRoundAction && this.activePlayer.currentRound.currentAction.type === 'CHECK_SCORE_CELL';
        },
        actionIsSelectDice() {
            return this.isCurrentRoundAction && this.activePlayer.currentRound.currentAction.type === 'SELECT_DICE';
        },
        showContinueRoundButton() {
            return this.isCurrentRoundActionDone && this.activePlayer.currentRound.currentAction.continueMode &&
                (this.actionIsSelectDice && this.activePlayer.currentRound.currentAction.selectedDiceList.length>0);
        },
    },
    methods: {
        async playRound() {
            this.activePlayer.currentRound={
                currentAction : null,
                done : false,
                finished : false,
                score : 0,
            }
            this.playRoundActions();
            return new Promise(resolve => {
                const checkIfRoundEnded = () => {
                    if (this.activePlayer.currentRound.finished) {
                        if(this.isTestMode) {
                            resolve();
                        }
                        else if(this.gameContent.timeAfterRound!=null){
                            setTimeout(resolve, (this.gameContent.timeAfterRound *1000));
                        } else {
                            resolve();
                        }
                    } else {
                        setTimeout(checkIfRoundEnded, 500);
                    }
                };
                checkIfRoundEnded();
            });
        },
        initRoundAction(action){
            this.activePlayer.currentRound.currentAction=Object.assign({}, action);
            this.activePlayer.currentRound.currentAction.done=false;
            this.activePlayer.currentRound.currentAction.remainingDiceTotal= this.activePlayer.currentRound.remainingDiceTotal;
            this.startRoundAction();
        },
        endRoundBySelectDice(){
            this.activePlayer.currentRound.score+=this.activePlayer.currentRound.currentAction.score
            if(this.activePlayer.currentRound.currentAction.selectableDices.length===0){
                this.activePlayer.currentRound.score=0;
            }
            this.activePlayer.score+=this.activePlayer.currentRound.score;
            this.activePlayer.currentRound.finished = true;
        },
        playRoundActions() {
            let actions = [...this.gameContent.actionList].sort((a, b) => a.index - b.index);
            this.activePlayer.currentRound.remainingDiceTotal = actions[0].diceTotal;
            this.initRoundAction(actions[0]);
        },
        startRoundAction() {
            if(this.isCurrentRoundAction) {
                switch (this.activePlayer.currentRound.currentAction.type) {
                    case "ROLL_DICE":
                        this.cleanDiceResult();
                        break;
                    case "CHECK_SCORE_CELL":
                        this.scoreCellChekDisabled=false;
                        break;
                    case "SELECT_DICE":
                        this.activePlayer.currentRound.currentAction.selectableDices=this.checkSelectableDice();
                        this.activePlayer.currentRound.currentAction.score=0;
                        break;
                    case "PLAY_CARD":
                        break;
                    default:
                        this.activePlayer.currentRound.currentAction = null;
                }
            }
        },
        endRoundAction(){
            this.activePlayer.currentRound.currentAction.done=true;
            let nextAction =this.getNextRoundAction();
            if(nextAction!== undefined){
                this.initRoundAction(nextAction);
            }
            else {
                this.activePlayer.currentRound.done=true;
            }
        },
        getNextRoundAction() {
            let currentIndex = this.activePlayer.currentRound.currentAction.index;
            let nextIndex = currentIndex + 1;
            return this.gameContent.actionList.find(action => action.index === nextIndex);
        },
        getContinueRoundAction(){
            let actions = [...this.gameContent.actionList].sort((a, b) => a.index - b.index);
            let nextAction=actions.find(action => action.index===this.activePlayer.currentRound.currentAction.continueStepIndex);
            return nextAction;
        },
        endRound(){
            switch (this.activePlayer.currentRound.currentAction.type) {
                case "CHECK_SCORE_CELL":
                    this.endRoundByCheckScoreCell();
                    break;
                case "SELECT_DICE":
                    this.endRoundBySelectDice();
                    break;
                default:
                    this.activePlayer.currentRound.finished = true;
            }

            this.activePlayer.currentRound.finished = true;
        },
        continueRound(){
            this.activePlayer.currentRound.score+=this.activePlayer.currentRound.currentAction.score
            if(this.activePlayer.currentRound.currentAction.continueMode){
                let nextAction = this.getContinueRoundAction();
                this.initRoundAction(nextAction);
            }
            else{
                this.endRoundAction();
            }
        },
    },

}