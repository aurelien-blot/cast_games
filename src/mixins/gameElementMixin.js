import DiceMixin from "@/mixins/diceMixin.js";
import CardMixin from "@/mixins/cardMixin.js";
import MathService from "@/services/mathService.js";

export default {
    mixins: [DiceMixin,CardMixin],
    data() {
        return {

        };
    },
    computed: {

    },
    methods: {
        initElements() {
            if(this.gameContent.elementList!=null && this.gameContent.elementList.length>0){
                this.gameContent.elementList.forEach(element => {
                    let newElement = {type: element.type, subtype: element.subtype, initMode : element.initMode, content:null};
                    switch (newElement.type) {
                        case "CARD_DECK":
                            newElement.content = this.createCardDeck(element.subtype);
                            break;
                        default:
                            console.log("initElements : mode non géré");
                    }
                    this.gameElementList.push(newElement);
                    if(element.initMode!=null){
                        this.initElement(newElement);
                    }
                });
            }
        },
        initElement(element) {
            switch (element.initMode) {
                case "DEAL_BETWEEN_PLAYERS":
                    this.shuffleElements(element.content);
                    this.dealBetweenPlayers(element);
                    break;
                default:
                    console.log("initElement : mode non géré");
            }
        },
        dealElements(content, playerList, elementField){
            let playerIndex = 0;
            let lastPlayerIndex = playerList.length-1;
            playerList.forEach(player => {
                if(player.currentRound===null){
                    player.currentRound = {};
                }
                if(player.currentRound.elementList===null){
                    player.currentRound.elementList = [];
                }
                let fieldExist = false;
                player.currentRound.elementList.forEach(element => {
                    if(element.field===elementField){
                        fieldExist = true;
                    }
                })
                if(!fieldExist){
                    let element = {field: elementField, value: []};
                    player.currentRound.elementList.push(element);
                }

            });
            for(let i=0; i<content.length; i++){
                let player = playerList[playerIndex];
                let field = player.currentRound.elementList.find(element => element.field===elementField);
                field.value.push(content[i]);
                if(playerIndex===lastPlayerIndex){
                    playerIndex = 0;
                }
                else{
                    playerIndex++;
                }
            }
        },
        shuffleElements(content){
            let currentIndex = content.length,  randomIndex;
            while (currentIndex !== 0) {
                randomIndex = MathService.getRandomInt(currentIndex);
                currentIndex--;
                [content[currentIndex], content[randomIndex]] = [
                    content[randomIndex], content[currentIndex]];
            }
            return content;
        },
        dealBetweenPlayers(element) {
            switch (element.type) {
                case "CARD_DECK":
                    this.dealElements(element.content, this.playerList ,'MAIN_DECK');
                    console.log(this.playerList);
                    break;
                default:
                    console.log("mode non géré");
            }
        },
    },

}