import DiceMixin from "@/mixins/diceMixin.js";
import CardMixin from "@/mixins/cardMixin.js";

export default {
    mixins: [DiceMixin,CardMixin],
    data() {
        return {
            globalCurrentRound : null,
            roundWinnerList : [],
        };
    },
    computed: {
        isGlobalCurrentRound(){
            return this.globalCurrentRound!=null;
        },
        isGlobalCurrentRoundAction(){
            return this.isGlobalCurrentRound && this.globalCurrentRound.currentAction!=null;
        },
        isGlobalCurrentRoundDone(){
            if(this.roundWinnerList===null || this.roundWinnerList.length!==1){
                return false;
            }
            return this.isAllPlayerRoundDone;
        },
        isGlobalCurrentRoundFinished(){
            if(this.playerList!=null && this.playerList.length>0){
                 let result = true;
                this.playerList.forEach(player => {
                    if(player.currentRound!=null && !player.currentRound.finished){
                        result= false;
                    }
                });
                return result;
            }
            return false;
        },
        isAllPlayerRoundDone(){
            if(this.playerList!=null && this.playerList.length>0){
                let result = true;
                this.playerList.forEach(player => {
                    if(player.currentRound!=null && !player.currentRound.done){
                        result= false;
                    }
                });
                return result;
            }
            return false;
        },
        showEndGlobalRoundButton() {
            return this.isGlobalCurrentRoundDone;
        }
    },
    methods: {
        initSimultaneousDatas() {
            this.initGlobalRound();
        },
        initGlobalRound(){
            this.globalCurrentRound = {
                done : false,
                finished : false,
                currentAction : null,
                potElementList : [],
            }
            this.initPlayerRound();
        },
        initPlayerRound(player){
            this.playerList.forEach(player => {
                player.currentRound={
                    pickedCard : null,
                    done : false,
                    finished : false,
                }
            });
        },
        playSimultaneous() {
            this.initGlobalRound();
            this.playSimultaneousActions();
            return new Promise(resolve => {
                const checkIfRoundEnded = () => {
                    if (this.isGlobalCurrentRoundFinished) {
                        this.dealPotCards();
                        if(this.isTestMode) {
                            resolve();
                        }
                        else if(this.gameContent.timeAfterRound!=null){
                            setTimeout(resolve, (this.gameContent.timeAfterRound *1000));
                        } else {
                            resolve();
                        }
                    }
                    else {
                        setTimeout(checkIfRoundEnded, 500);
                    }
                };
                checkIfRoundEnded();
            });
        },
        playSimultaneousActions() {
            let actions = [...this.gameContent.actionList].sort((a, b) => a.index - b.index);
            this.initGlobalAction(actions[0]);
        },
        initGlobalAction(action){
            this.globalCurrentRound.currentAction=Object.assign({}, action);
            this.globalCurrentRound.currentAction.done=false;
            this.globalCurrentRound.currentAction.finished=false;
            this.startAction();
        },
        startAction() {
            if(this.isGlobalCurrentRoundAction) {
                switch (this.globalCurrentRound.currentAction.type) {
                    case "PLAY_CARD":
                        break;
                    case "CARD_IN_POT":
                        break;
                    default:
                        this.globalCurrentRound.currentAction = null;
                }
            }
        },
        endGlobalRound(player){
            player.currentRound.finished = true;
        },
        playSimultaneousAction(player) {
            if(this.currentActionType==="PLAY_CARD"){
               this.pickCard(player);
               this.globalCurrentRound.potElementList.push(player.currentRound.pickedCard);
            }
            this.roundWinnerList = this.calculateRoundWinnerList();
            if(this.roundWinnerList.length>1){
                this.playDrawAction();
            }
        },
        calculateRoundWinnerList(){
            let winnerList = [];
            if(this.isAllPlayerRoundDone){
                let maxCardValue = 0;
                this.playerList.forEach(player => {
                    if(player.currentRound.pickedCard.value>maxCardValue){
                        maxCardValue = player.currentRound.pickedCard.value;
                    }
                });
                this.playerList.forEach(player => {
                    if(player.currentRound.pickedCard.value===maxCardValue){
                        winnerList.push(player);
                    }
                });
            }
            return winnerList;
        },
        dealPotCards(){
            if(this.roundWinnerList.length===1){
                let winner = this.playerList.find(player => player.id===this.roundWinnerList[0].id);
                if(winner!=null){
                    let discardElementList = [...winner.discardElementList];
                    let winnerDiscard = discardElementList.find(element => element.key==="MAIN_DECK");
                    if(winnerDiscard!=null){
                        winnerDiscard.value.push(...this.globalCurrentRound.potElementList);
                    }
                    winner.discardElementList=discardElementList;
                }
                this.globalCurrentRound.potElementList = [];
            }
            else{
                console.error("no winner");
            }
        },
        playDrawAction(){
            if(this.drawAction!=null){
                this.initGlobalAction(this.drawAction);
            }
        },

    },

}