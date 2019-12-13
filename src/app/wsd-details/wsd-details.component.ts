import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { WsdDetailsService } from "./services/wsd-details.services";
import { MessageDialogService, MessageType } from "../message-dialog/services/message-dialog.service";
import { WsdWsdlUiService } from "./services/wsd-wsdl-ui.service";
import { ActiveStageService, Stage } from '../shared/services/active-stage.service';

@Component({
  //  selector: "app-wsd-details",
    templateUrl: "./wsd-details.component.html",
    styleUrls: ["./wsd-details.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class WsdDetailsComponent implements OnInit {

    wsdDetails;
    @Input() wsdName;
    wsdOperations;
    activeTab;
    wsdlXml = null;
    isWsdXmlDone = false;
    isWsdDetailsDone = false;
    isWsdlFirst;
    linkUrl = "wsd/list";

    @Input() projectName = "";
    @Input() csrf = "";

    constructor(
        public activeStage: ActiveStageService,
        private wsdWsdlUiService: WsdWsdlUiService,
        private messageDialogService: MessageDialogService,
        private wsdDetailsService: WsdDetailsService) { }

    ngOnInit() {
        const currentStage: Stage = {
            "id": "stage00",
            "displayName": "Development"
        };
        this.activeStage.setActiveStage(currentStage);
      //  document.dispatchEvent(new CustomEvent("HELPLINK", { detail: { displayHelpLabel: "SOAP-APIS", helpLink: "soapapis.html" } }));
      //  this.loaderService.showWithCaption(this.translateService.translate("LOADING"));
       // const path = this.routeService.getCrumbs();
     //   this.wsdName = path[5];
      //  this.linkUrl = this.routeService.getNg6ProjectName() + "/" + this.linkUrl;
        this.getWsdDetails();
        if (localStorage.getItem("wsdActiveTabIndex") === "0") {
            this.activeTab = 0;
            localStorage.removeItem("wsdActiveTabIndex");
        } else if (localStorage.getItem("wsdActiveTabIndex") === "1") {
            this.activeTab = 1;
            localStorage.removeItem("wsdActiveTabIndex");
        }
    }

    getModifiedOperations() {
        this.getWsdDetails();
    }

    getWsdlFile() {
        this.wsdWsdlUiService.getWsdlXml(this.wsdName, this.projectName, this.csrf).subscribe((wsdlXml) => {
            this.wsdlXml = wsdlXml;
          //  this.loaderService.hide();
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error.integration &&
                 errorResponse.error.integration.message && errorResponse.error.integration.message.description) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
            this.wsdlXml = null;
          //  this.loaderService.hide();
        });
    }

    getWsdDetails() {
        this.wsdDetailsService.getWsdDetails(this.wsdName, this.projectName, this.csrf).subscribe((wsdDetails) => {
            this.wsdDetails = wsdDetails;
            this.isWsdlFirst = wsdDetails.isWSDLFirst;
            this.wsdOperations = wsdDetails.operationList;
            let allOperationAreResolved = true;
          //  for (let i = 0; i < this.wsdOperations.length; i++ ) {
            for (const wsdOperation of this.wsdOperations ) {
                if (wsdOperation && wsdOperation.resolved === false) {
                    allOperationAreResolved = false;
                }
            }
            if (allOperationAreResolved) {
                this.getWsdlFile();
            } else {
              //  this.loaderService.hide();
            }
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error.integration &&
                 errorResponse.error.integration.message && errorResponse.error.integration.message.description) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
           // this.loaderService.hide();
        });
    }

    setActiveTabIndex(index) {
        this.activeTab = index;
    }


}
