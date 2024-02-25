import DiceMixin from "@/mixins/diceMixin.js";
import CardMixin from "@/mixins/cardMixin.js";

export default {
    mixins: [],
    data() {
        return {

        };
    },
    computed: {

    },
    methods: {
        initPlayers() {
            this.defineInitialPlayerOrder();
            this.playerList.forEach(player => {
                player.score = 0;
                player.order = player.initialOrder;
                player.elementList=[];
                player.discardElementList=[];
                if(this.gameContent.individualScoreSheet!=null){
                    player.scoreSheet = this.initScoreSheet();
                }
            });
            if(this.isTestMode){
                this.logPlayerList();
            }
        },
        defineInitialPlayerOrder() {
            if(this.gameContent.startMode==="RANDOM"){
                this.playerList.sort(() => Math.random() - 0.5);
                for(let i = 0; i < this.playerList.length; i++) {
                    this.playerList[i].initialOrder = i+1;
                }
            }
        },
        logPlayerList() {
            this.playerList.forEach(player => {
                console.log(player.id +" - "+player.name + " :  " + player.order+"/"+this.playerList.length+ " :  " + player.score);
            });
        },
        defineNextPlayer() {
            if(this.gameContent.playerData.orderMode==="STANDARD") {
                let nextPlayerIndex = this.activePlayer.order;
                if(nextPlayerIndex === this.playerList.length) {
                    nextPlayerIndex = 1;
                } else {
                    nextPlayerIndex++;
                }
                this.activePlayer = this.playerList.find(player => player.order === nextPlayerIndex);
            }
        },
    },

}