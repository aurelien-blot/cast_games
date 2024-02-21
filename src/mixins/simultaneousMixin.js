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
        }
    },
    methods: {
        initSimultaneousDatas() {
            this.playerList.forEach(player => {
                player.currentRound={
                    elementList : [],
                    pickedCard : null,
                    done : false,
                }
            });
            this.globalCurrentRound = {
                done : false,
                currentAction : null,
            }
        },
        playSimultaneous() {
            this.playSimultaneousActions();
            return new Promise(resolve => {
                if (this.globalCurrentRound.done) {
                    if(this.isTestMode) {
                        resolve();
                    }
                    else if(this.gameContent.timeAfterRound!=null){
                        setTimeout(resolve, (this.gameContent.timeAfterRound *1000));
                    } else {
                        resolve();
                    }
                }
                const checkIfSimultaneousEnded = () => {
                    setTimeout(checkIfSimultaneousEnded, 500);
                };
                checkIfSimultaneousEnded();
            });
        },
        playSimultaneousActions() {
            let actions = [...this.gameContent.actionList].sort((a, b) => a.index - b.index);
            this.initGlobalAction(actions[0]);
        },
        initGlobalAction(action){
            this.globalCurrentRound.currentAction=Object.assign({}, action);
            this.globalCurrentRound.currentAction.done=false;
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
    },

}