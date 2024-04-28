import store from "@/store/store.js";
import ErrorService from "@/services/errorService.js";
import MessageExchangeService from "@/services/messages/messageExchangeService.js";

export default class SseService {

    static URL_BASE_SSE = "http://localhost:8081/api/conversation/stream";
    static INIT_CONVERSATIONS = "INIT_CONVERSATIONS";
    static UPDATE_CONVERSATIONS = "UPDATE_CONVERSATIONS";
    constructor() {
        this.eventSource = null;
    }

    connect(callback) {
        const connectedPlayerId = store.state.auth.user.playerId;
        this.eventSource = new EventSource(`${SseService.URL_BASE_SSE}/${connectedPlayerId}`);
        this.eventSource.onopen = () => {
            //console.log('SSE opened');
        };
        this.eventSource.addEventListener(SseService.INIT_CONVERSATIONS, event => {
            const data = JSON.parse(event.data);
            callback(data);
        });
        this.eventSource.addEventListener(SseService.UPDATE_CONVERSATIONS, event => {
            const data = JSON.parse(event.data);
            callback(data);
        });
        this.eventSource.onerror = error => {
            if (this.eventSource.readyState !== EventSource.CLOSED) {
                console.error('SSE connection error:', error);
                ErrorService.showErrorInAlert(error);
            }
            this.close();

        };
    }
    close() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }
}