import DiceMixin from "@/mixins/diceMixin.js";
import CardMixin from "@/mixins/cardMixin.js";

export default {
    mixins: [],
    data() {
        return {

        };
    },
    computed: {
        drawAction(){
            if(this.gameContent!=null
                && this.gameContent.eventActionList !=null
                && this.gameContent.eventActionList.length>0){
                let action= this.gameContent.eventActionList.find(action => action.condition === "DRAW");
                if(action!=null){
                    return action;
                }
            }
            return false;
        }
    },
    methods: {

    },

}