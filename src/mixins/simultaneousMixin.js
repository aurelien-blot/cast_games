export default {
    data() {
        return {
            globalCurrentRound : null,
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
        showEndGlobalRoundButton() {
            return this.isGlobalCurrentRoundDone;
        }
    },
    methods: {
        initSimultaneousDatas() {
            this.playerList.forEach(player => {
                player.currentRound={
                    elementList : [],
                    pickedCard : null,
                    done : false,
                    finished : false,
                }
            });
            this.globalCurrentRound = {
                done : false,
                finished : false,
                currentAction : null,
            }
        },
        playSimultaneous() {
            this.playSimultaneousActions();
            return new Promise(resolve => {
                //TODO LOOP INFINIE A REVOIR
                const checkIfRoundEnded = () => {
                    if (this.isGlobalCurrentRoundDone) {
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
            if(this.isCurrentRoundAction) {
                switch (this.globalCurrentRound.currentAction.type) {
                    case "PLAY_CARD":
                        break;
                    default:
                        this.globalCurrentRound.currentAction = null;
                }
            }
        },
        endGlobalRound(player){
            player.currentRound.finished = true;
        },
        resolveDoneRoundAction(){
            let winner = this.calculateRoundWinner();
            console.log(winner.name)
            //this.doDoneRoundAction();
        },
        calculateRoundWinner(){
            let winner = null;
            this.playerList.forEach(player => {
                if(winner==null || player.currentRound.pickedCard.value>winner.currentRound.pickedCard.value){
                    winner = player;
                }
            });
            return winner;
        },

    },

}