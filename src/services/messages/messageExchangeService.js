import SseService from "@/services/messages/sseService.js";

export default class MessageExchangeService {

    static SERVICE_USED = "SSE"
    static eventSource = null;

    static connect(onInitConversation, onUpdateConversation) {
        if(this.SERVICE_USED === "SSE") {
            this.connectSse(onInitConversation, onUpdateConversation)
        }
    }

    static close() {
        if(this.SERVICE_USED === "SSE") {
            this.closeSse()
        }
    }

    static connectSse(onInitConversation, onUpdateConversation) {
        if (this.eventSource) {
            this.eventSource.close();
        }
        this.sseEventSource = new SseService();
        this.sseEventSource.connect(onInitConversation, onUpdateConversation);
    }

    static closeSse() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }


}