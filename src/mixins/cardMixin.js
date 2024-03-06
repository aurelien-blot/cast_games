export default {
    data() {
        return {

        };
    },
    computed: {

    },
    methods: {
        createCardDeck(deckType) {
            let cardType;
            let deckContent = [];
            if(deckType==="32_CARDS_SET" || deckType==="64_CARDS_SET"){
                cardType = "CLASSIC";
            }
            if(cardType==="CLASSIC"){
                let colors = [
                    { key :"HEARTS",label : "Coeur" },
                    { key :"DIAMONDS",label : "Carreau" },
                    { key :"CLUBS",label : "Trèfle" },
                    { key :"SPADES",label : "Pique" }];
                colors.forEach(color => {
                    if(deckType==="64_CARDS_SET"){
                        for (let i = 2; i < 7; i++) {
                            let value=i;
                            deckContent.push({value: value, label: this.getClassicCardLabel(value, color), color: color.key,  id : value+ "_" + color.key, selected: false});
                        }
                    }
                    if(deckType==="64_CARDS_SET" || deckType==="32_CARDS_SET"){
                        deckContent.push({value: 14, label: this.getClassicCardLabel("As", color), color: color.key,  id : 1+ "_" + color.key, selected: false});
                        for (let i = 7; i < 14; i++) {
                            let label;
                            if(i<=10){
                                label=i;
                            }
                            else{
                                switch (i) {
                                    case 11:
                                        label="Valet";
                                        break;
                                    case 12:
                                        label="Reine";
                                        break;
                                    case 13:
                                        label="Roi";
                                        break;
                                    default:
                                        break;
                                }
                            }
                            deckContent.push({value: i, label:this.getClassicCardLabel(label, color),  color: color,  id : label+ "_" + color.key, selected: false});
                        }
                    }
                });
                return deckContent;
            }
        },
        getClassicCardLabel(value, color){
            return value + " de " + color.label;
        },
        pickCard(player){
            let deck = player.elementList.find(element => element.key==="MAIN_DECK").value;
            if(player.currentRound.done){
                return;
            }
            player.currentRound.pickedCard = this.pickTopCard(deck);
            deck.pop();
            player.currentRound.done = true;
        },
        pickTopCard(deck){
            if(this.isTestMode){
                return {
                    color :{key: 'DIAMONDS', label: 'Carreau'},
                    id : "9_DIAMONDS",
                    label : "9 de Carreau",
                    selected : false,
                    value : 9
                }
            }
            return deck[deck.length-1];
        }
    },

}