import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from "@angular/core";
import { UpsertCustomWsdService } from "./services/upsert-custom-wsd.service";
import { Subscription } from "rxjs";
import { RestOperationService } from "./services/rest-operation.service";
import { WsdDetailsService } from "./services/wsd-details.services";
import { MessageDialogService, MessageType } from "../message-dialog/services/message-dialog.service";

@Component({
//    selector: "app-upsert-custom-wsd",
    templateUrl: "./upsert-custom-wsd.component.html",
    styleUrls: ["./upsert-custom-wsd.component.scss"],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class UpsertCustomWsdComponent implements OnInit, OnDestroy {
    mode = "add";
    wsdName: string;
    validationMessageOfWsdName: string;
    linkText = "SOAP APIs";
    linkUrl = "wsd/list";
    soapVersion;
    complianceType = [
        { name: "Strict" },
        { name: "Lax" },
        { name: "None" }
    ];
    // selectedComplianceType = "None";
    wsiCompliance = false;
    xercesValidation = false;
    attachmentEnabled = false;
    showWsdlOperationModal = false;
    integrations;
    selectedIntegration;
    integrationOperationMap = [];
    selectedOperationName;
    bindingUseAndStyle;
    bindingUse = "literal";
    bindingStyle = "document";
    opsModalButton = "ADD";
    operationSet = new Set();
    opsIndex;
    isPageDirty = false;
    isSaveFromDialog = false;
    subManager = new Subscription();
    @ViewChild("saveButton", {static: true}) saveButton: ElementRef;
    documentFile = "createSOAPAPI_scratch.html";
    integrationname = "";
    @Input() projectName = "";
    @Input() csrf = "";

    @Output() finish: EventEmitter<any> = new EventEmitter();

    constructor(
        private restOperationService: RestOperationService,
        private wsdDetailsService: WsdDetailsService,
        private messageDialogService: MessageDialogService,
        private upsertCustomWsdService: UpsertCustomWsdService) { }


    validateName(message) {
        this.validationMessageOfWsdName = message;
    }

    ngOnInit() {
     //   document.dispatchEvent(new CustomEvent("HELPLINK", { detail: 
     // { displayHelpLabel: "Creating SOAP APIs from scratch", helpLink: "createSOAPAPI_scratch.html" } }));
    //    const path = this.routeService.getCrumbs();
     //   this.wsdName = path[5];
        if (this.wsdName) {
            this.mode = "edit";
            this.getWsdDetails();
        }
       // this.linkUrl = this.routeService.getNg6ProjectName() + "/" + this.linkUrl;
        this.restOperationService.getIntegrationNames(this.projectName, this.csrf).subscribe((integrationList) => {
            this.integrations = integrationList;
        });
        if (localStorage.getItem("wsdNavigationLink")) {
            const link = JSON.parse(localStorage.getItem("wsdNavigationLink"));
            this.linkText = link.linkText;
            this.linkUrl = link.linkUrl;
            localStorage.removeItem("wsdNavigationLink");
        }
     //   this.saveRedirectService.initialize();
     //   this.subManager.add(this.saveRedirectService.saveClick.subscribe(this.saveDialogOkClick));
    }

    canDeactivate(currentRoute, currentState, nextState) {
        return true;
        // if (this.saveButton.nativeElement.disabled || this.saveRedirectService.canDeactivate) {
        //     return of(true);
        // } else {
        //     let nextUrl = nextState.url;
        //     if (nextUrl === "") {
        //         nextUrl = location.hash;
        //     }
        //   //  return this.saveRedirectService.open("Save SOAP API", "Do you want to save the SOAP API ?", nextUrl);
        // }
    }

    saveDialogOkClick = () => {
        this.isSaveFromDialog = true;
        this.submitWsdForm();
    }


    getWsdDetails() {
      //  this.loaderService.showWithCaption(this.tranlateService.translate("LOADING"));
        this.wsdDetailsService.getWsdDetails(this.wsdName, this.projectName, this.csrf).subscribe((response) => {
            this.soapVersion = response.binderList[0].SOAPProtocol === "SOAP 1.1 Protocol" ? "soap11" : "soap12";
            this.wsiCompliance = response.WSICompliant;
            this.xercesValidation = response.validateSchemaUsingXerces;
            this.attachmentEnabled = response.attachmentEnabled;
            this.bindingUseAndStyle = response.binderList[0].bindingStyle + "-" + response.binderList[0].bindingUse;
            this.bindingStyle = response.binderList[0].bindingStyle;
            this.bindingUse = response.binderList[0].bindingUse;
            if (response.operationList) {
                this.integrationOperationMap = response.operationList.map((ops) => {
                    this.operationSet.add(ops.operationName);
                    const operationData = { operationName: ops.operationName, serviceName: ops.serviceName.split(":")[1] };
                    return operationData;
                });
            }
          //  this.loaderService.hide();
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error && errorResponse.error.integration && errorResponse.error.integration.message) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
           // this.loaderService.hide();
        });
    }

    navigateToWsdlList() {
     //   location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/list";
    }

    toggleWsiCompliance() {
        this.isPageDirty = true;
        this.wsiCompliance = !this.wsiCompliance;
    }

    addOperation(index?) {
        this.isPageDirty = true;
        if (this.opsModalButton === "ADD") {
            this.operationSet.add(this.selectedOperationName);
            this.integrationOperationMap.push({ serviceName: this.selectedIntegration, operationName: this.selectedOperationName });
            this.showWsdlOperationModal = false;
        } else {
            const ops = this.integrationOperationMap[this.opsIndex];
            this.operationSet.delete(ops.operationName);
            this.integrationOperationMap[this.opsIndex] = {
                serviceName: this.selectedIntegration,
                operationName: this.selectedOperationName
            };
            this.showWsdlOperationModal = false;
            this.operationSet.add(this.selectedOperationName);
        }
    }

    onIntegrationSelect(e) {
        if (this.integrationname) {
            this.selectedIntegration = this.integrationname;
            this.integrationOperationMap.push({ serviceName: this.selectedIntegration, operationName: this.selectedIntegration });
        } else {
            this.selectedIntegration = null;
            this.integrationOperationMap = [];
        }
    }

    onIntegrationFieldBlur(integration) {
        this.selectedIntegration = integration;
        this.integrationOperationMap = [];
    }

    setSoapVersion(soapVersion) {
        this.soapVersion = soapVersion;
    }

    setBinding(bindingUseAndStyle, bindingUse, bindingStyle) {
        this.isPageDirty = true;
        this.bindingUseAndStyle = bindingUseAndStyle;
        this.bindingUse = bindingUse;
        this.bindingStyle = bindingStyle;
    }

    // selectComplianceType(selectedComplianceType) {
    //     this.selectedComplianceType = selectedComplianceType.name;
    // }

    toggleXercesValidation() {
        this.isPageDirty = true;
        this.xercesValidation = !this.xercesValidation;
    }

    toggleAttachmentEnabled() {
        this.isPageDirty = true;
        this.attachmentEnabled = !this.attachmentEnabled;
    }

    getCreationData() {
        const wsdData = {
            "integration": {
                "serviceData": {
                    "node_nsName": this.wsdName,
                    "WSICompliant": this.wsiCompliance,
                    "validateSchemaUsingXerces": this.xercesValidation,
                    "attachmentEnabled": this.attachmentEnabled,
                    "soapVersion": this.soapVersion,
                    "bindingStyle": this.bindingStyle,
                    "bindingUse": this.bindingUse,
                    "wsdlOperations": this.integrationOperationMap
                }
            }
        };
        return wsdData;
    }

    getWsdUpdateData() {
        const wsdData = {
            "integration": {
                "serviceData": {
                    "WSICompliant": this.wsiCompliance,
                    "validateSchemaUsingXerces": this.xercesValidation,
                    "attachmentEnabled": this.attachmentEnabled,
                    "bindingStyle": this.bindingStyle,
                    "bindingUse": this.bindingUse
                }
            }
        };
        return wsdData;
    }

    getWsdOperations() {
        const wsdData = {
            "integration": {
                "serviceData": {
                    "wsdlOperations": this.integrationOperationMap
                }
            }
        };
        return wsdData;
    }

    submitWsdForm() {
        if (this.mode === "add") {
            this.createWsd();
        } else {
            this.updateWsdData();
        }
    }

    onSelectedOps(event) {
        this.selectedOperationName = event.operationName;
        this.selectedIntegration = event.serviceName;
    }

    onOpsDelete(index) {
        this.isPageDirty = true;
        this.operationSet.delete(this.selectedOperationName);
        this.integrationOperationMap = this.integrationOperationMap.filter((ops) => ops.operationName !== this.selectedOperationName);
        this.selectedIntegration = null;
        this.selectedOperationName = null;
    }

    onOpsEdit(index) {
        this.opsModalButton = "UPDATE";
        this.showWsdlOperationModal = true;
        this.opsIndex = index;
    }

    createWsd() {
        // this.loaderService.showWithCaption(this.tranlateService.translate("LOADING"));
        const wsdCreationData = this.getCreationData();
        const appData = new Blob([JSON.stringify(wsdCreationData)], { type: "application/json" });
        const formData = new FormData();
        formData.append("wsdInputData", appData);
        console.log(this.projectName + ":::" + this.csrf);
        this.upsertCustomWsdService.createIntegrationFirstWsd(formData, this.projectName, this.csrf).subscribe((message) => {
            if (message) {
                this.messageDialogService.show(message, MessageType.success);
            }
           // this.saveRedirectService.canDeactivate = true;
           // this.loaderService.hide();
            if (this.isSaveFromDialog) {
               // this.saveRedirectService.navigateOnSave();
            } else {
              //  this.navigateToWsdViewPage();
              // TODO:: emit event once afeter create
            }
            this.finish.emit("created successfully.");
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error.integration &&
                errorResponse.error.integration.message && errorResponse.error.integration.message.description) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
           // this.saveRedirectService.canDeactivate = false;
            // this.loaderService.hide();
        });
    }

    updateWsdData() {
     //   this.loaderService.showWithCaption(this.tranlateService.translate("LOADING"));
        const wsdCreationData = this.getWsdUpdateData();
        const appData = new Blob([JSON.stringify(wsdCreationData)], { type: "application/json" });
        const formData = new FormData();
        formData.append("wsdInputData", appData);
        this.upsertCustomWsdService.updateIntegrationFirstWsd(this.wsdName, formData).subscribe((message) => {
            if (message) {
                this.messageDialogService.show(message, MessageType.success);
            }
           // this.loaderService.hide();
          //  this.saveRedirectService.canDeactivate = true;
            if (this.isSaveFromDialog) {
             //   this.saveRedirectService.navigateOnSave();
            } else {
                this.navigateToWsdViewPage();
            }
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error.integration &&
                errorResponse.error.integration.message && errorResponse.error.integration.message.description) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
           // this.saveRedirectService.canDeactivate = false;
           // this.loaderService.hide();
        });
    }

    navigateToWsdViewPage() {
        // const path = this.routeService.getCrumbs();
        // if (this.mode === "add") {
        //     location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/view/" + this.wsdName;
        // } else {
        //     location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/list";
        // }
    }

    isSaveButtonEnabled() {
        if (this.mode === "add") {
            return !(this.wsdName && this.soapVersion && this.bindingStyle &&
                this.bindingUse && this.bindingUseAndStyle && this.integrationOperationMap.length >= 1);
        } else {
            return !this.isPageDirty;
        }
    }

    ngOnDestroy(): void {
        this.subManager.unsubscribe();
    }
}
