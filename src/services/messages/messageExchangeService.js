import SseService from "@/services/messages/sseService.js";

export default class MessageExchangeService {

    static SERVICE_USED = "SSE"
    static eventSource = null;

    static connect(callback) {
        if(this.SERVICE_USED === "SSE") {
            this.connectSse(callback)
        }
    }

    static close() {
        if(this.SERVICE_USED === "SSE") {
            this.closeSse()
        }
    }

    static connectSse(callback) {
        if (this.eventSource) {
            this.eventSource.close();
        }
        this.sseEventSource = new SseService();

        this.sseEventSource.connect(data => {
            callback(data);
        });
    }

    static closeSse() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }


}