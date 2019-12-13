import { Component, OnDestroy, OnInit, HostListener } from "@angular/core";
import { MessageDialogService } from "./services/message-dialog.service";

@Component({
  selector: "app-message-dialog",
  templateUrl: "./message-dialog.component.html",
  styleUrls: ["./message-dialog.component.scss"]
})
export class MessageDialogComponent {

  constructor(public messageDialogService: MessageDialogService) { }

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (this.messageDialogService.message) {
      this.messageDialogService.hide();
    }
    // if (this.eRef.nativeElement.contains(event.target)) {
  }

  closeMessage() {
    this.messageDialogService.hide();
  }

}
