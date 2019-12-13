import { async, ComponentFixture, TestBed, getTestBed } from "@angular/core/testing";
import { MessageDialogComponent } from "./message-dialog.component";
import { MessageDialogService, MessageType } from "./services/message-dialog.service";
import { By } from "@angular/platform-browser";
import { Component, ViewChild } from "@angular/core";

describe("MessageDialogComponent", () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let messageDialogService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDialogComponent, TestHostComponent],
      providers : [ MessageDialogService ]
    }).compileComponents();
    messageDialogService = getTestBed().get(MessageDialogService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should not display message when the input 'message' is empty", () => {
    const element = fixture.debugElement.query(By.css(".msgdiv"));
    expect(element).toBeNull();
  });

  it("should call 'clickout' method when clicked anywhere in the document", () => {
    spyOn(messageDialogService, "hide").and.callThrough();
    spyOn(component.messageDialog, "clickout").and.callThrough();
    messageDialogService.message = "Test Message";
    messageDialogService.messageType = MessageType.success;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css("div"));
    element.nativeElement.click();
    fixture.detectChanges();
    expect(component.messageDialog.clickout).toHaveBeenCalled();
    expect(messageDialogService.hide).toHaveBeenCalled();
    expect(messageDialogService.message).toEqual("");
    expect(fixture.debugElement.query(By.css("#msgdiv"))).toBeNull();
  });

  it("should call 'closeMessage' method when the close button is clicked", () => {
    spyOn(messageDialogService, "hide").and.callThrough();
    spyOn(component.messageDialog, "closeMessage").and.callThrough();
    messageDialogService.message = "Test Message";
    messageDialogService.messageType = MessageType.success;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css(".close"));
    element.nativeElement.click();
    fixture.detectChanges();
    expect(component.messageDialog.closeMessage).toHaveBeenCalled();
    expect(messageDialogService.hide).toHaveBeenCalled();
    expect(fixture.debugElement.query(By.css("#msgdiv"))).toBeNull();
  });

  it("should not display message type icons when the input 'message' is provided and 'messageType' is not provided", () => {
    messageDialogService.message = "Test Message";
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css("#msgdiv"));
    const messageDialogIcon = fixture.debugElement.query(By.css(".message-dialog-wmic-icon"));
    const closeButton = fixture.debugElement.query(By.css(".close"));
    expect(element).not.toBeNull();
    expect(messageDialogIcon).toBeNull();
    expect(closeButton).not.toBeNull();
  });

  it("should display message with respective message type styles when the inputs 'message' and 'messageType' are provided.", () => {
    messageDialogService.message = "Test Danger Message";
    messageDialogService.messageType = MessageType.danger;
    fixture.detectChanges();
    const dangerIcon = fixture.debugElement.query(By.css(".message-dialog-wmic-icon.danger-alert"));
    const infoIcon = fixture.debugElement.query(By.css(".message-dialog-wmic-icon.info-alert"));
    expect(dangerIcon).not.toBeNull();
    expect(infoIcon).toBeNull();
    const dangerElement = fixture.debugElement.query(By.css(".message-dialog-text.danger-alert"));
    const infoElement = fixture.debugElement.query(By.css(".message-dialog-text.info-alert"));
    expect(dangerElement.nativeElement.innerText).toEqual("Test Danger Message");
    expect(infoElement).toBeNull();
  });

});

@Component({
  template : `
  <div>
    <app-message-dialog #messageDialog></app-message-dialog>
  </div>
  `
})
export class TestHostComponent {
  @ViewChild("messageDialog") messageDialog;
}
