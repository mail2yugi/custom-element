import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class MessageDialogService {
    message;
    messageType;

    /*
     * Shows the alert message when called.
     */
    show(message, messageType, duration = 10000, isPersist = false) {
        this.message = message;
        this.messageType = messageType;
        if (messageType !== MessageType.danger && !isPersist) {
            this.hideAfter(duration);
        }
    }

    /*
     * Hides the alert message after showing for duration specified.
     */
    hideAfter(duration) {
        const timeout = setTimeout(() => {
            clearTimeout(timeout);
            this.hide();
        }, duration);
    }

    /*
     * Hide the alert message.
     */
    hide() {
        this.message = "";
    }
}

export enum MessageType {
    success = 1,
    danger = 2,
    info = 3,
    warning = 4,
    bulkError = 5
}
