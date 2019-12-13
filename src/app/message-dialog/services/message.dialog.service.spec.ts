import { fakeAsync, tick } from "@angular/core/testing";
import { MessageDialogService, MessageType } from "./message-dialog.service";

describe("MessageDialogService", () => {
    let messageDialogService;
    beforeEach( () => {
        messageDialogService = new MessageDialogService();
    });

    it("shoud show message and hide after 10 seconds", () => {
        spyOn(messageDialogService, "hideAfter");
        messageDialogService.show("success-message", MessageType.success);
        expect(messageDialogService.message).toEqual("success-message");
        expect(messageDialogService.messageType).toEqual(MessageType.success);
        expect(messageDialogService.hideAfter).toHaveBeenCalledWith(10000);
    });

    it("should verify the persistence of the error or danger message.", () => {
        spyOn(messageDialogService, "hideAfter");
        messageDialogService.show("error-message", MessageType.danger);
        expect(messageDialogService.message).toEqual("error-message");
        expect(messageDialogService.messageType).toEqual(MessageType.danger);
        expect(messageDialogService.hideAfter).not.toHaveBeenCalled();
    });

    it("shoud hide message after showing for the specified time", fakeAsync(() => {
        spyOn(messageDialogService, "hideAfter").and.callThrough();
        spyOn(messageDialogService, "hide").and.callThrough();
        messageDialogService.show("success-message", MessageType.success, 3);
        tick(8);
        expect(messageDialogService.hideAfter).toHaveBeenCalledWith(3);
        expect(messageDialogService.hide).toHaveBeenCalled();
        expect(messageDialogService.message).toEqual("");
    }));

    it("shoud show message and should not hide after 10 seconds when isPersist is true", () => {
        spyOn(messageDialogService, "hideAfter");
        messageDialogService.show("success-message", MessageType.success, 0, true);
        expect(messageDialogService.message).toEqual("success-message");
        expect(messageDialogService.messageType).toEqual(MessageType.success);
        expect(messageDialogService.hideAfter).not.toHaveBeenCalled();
    });
});
