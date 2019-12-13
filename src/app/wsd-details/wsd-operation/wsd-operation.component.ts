import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { WsdOperationService } from "./services/wsd-operation.service";
import { RestOperationService } from "src/app/upsert-custom-wsd/services/rest-operation.service";
import { MessageDialogService, MessageType } from "src/app/message-dialog/services/message-dialog.service";
import { ActiveStageService } from "src/app/shared/services/active-stage.service";
declare var $;

@Component({
    selector: "app-wsd-operation",
    templateUrl: "./wsd-operation.component.html"
})
export class WsdOperationComponent implements OnInit {

    documentEditorsData;
    showDocumentTypeModal = false;
    showDeleteModal = false;
    documentTypeName;
    operations = [];
    allOperationAreResolved = false;
    operationsSet = new Set();
    @Input() wsdName;
    @Input() isWsdlFirst;
    @Input() set setOperation(operations) {
        if (operations) {
            this.allOperationAreResolved = true;
            this.operationsSet = new Set();
            // for (let i = 0; i < operations.length; i++ ) {
            for (const operation of operations) {
                this.operationsSet.add(operations.operationName);
                if (operation.resolved ===  false) {
                    this.allOperationAreResolved = false;
                }
            }
            this.operations = operations;
        }
    }
    @Output() operationChange: EventEmitter<any> = new EventEmitter();
    showACLModal = false;
    selectedIntegration;
    isaclMappingPermissionPresent;
    aclList;
    associatedACLWithIntegration;
    selectedAcl;
    showAddOperartionModal;
    integrations;
    selectedRow;
    wsdOperationName;
    showIntegrationSearchRow = false;
    filterIntegration;
    filterOperation;
    filterConfig = {
        strings: [
            {
                attribute: "operationName",
                index: 0
            },
            {
                attribute: "serviceName",
                index: 1
            }

        ]
    };
    opsIndex;
    selectedOpsName;
    operationValidationMessage: string;
    @Input() projectName = "";
    @Input() csrf = "";

    constructor(
        private router: Router,
        public activeStage: ActiveStageService,
        private restOperationService: RestOperationService,
        private messageDialogService: MessageDialogService,
        private wsdOperationService: WsdOperationService) {
    }

    ngOnInit() {
        this.restOperationService.getIntegrationNames(this.projectName, this.csrf).subscribe((integrationList) => {
            this.integrations = integrationList;
        });
       // this.isaclMappingPermissionPresent = this.userService.getGeneralCapabilities()[2] ? true : false;
    }

    nodeAction(nodeData) {
        if (this.isWsdlFirst) {
            this.navigateToOrchestrationPage(nodeData.serviceName, nodeData.integrationType);
        } else if (nodeData.resolved) {
            this.navigateToOrchestrationPage(nodeData.serviceName, nodeData.integrationType);
        }
    }

    getClassName(nodeData) {
        if (nodeData) {
            if (nodeData.serviceFullName) {
                return "link-button link-underline wsd-integration-label";
            }
            if (nodeData.documentType) {
                return "wsd-docs-label";
            }
        }
    }

    getClassNameForNode(nodeData) {
        if (nodeData && nodeData.integrationName) {
            return "wsd-operation-label";
        }
    }

    navigateToOrchestrationPage(serviceFullName, integrationType) {
        if (serviceFullName) {
            const integrationName = serviceFullName.split(":")[1];
         //   const path = this.routeService.getHash();
            localStorage.setItem("wsdActiveTabIndex", "1");
         //   this.navigationContextService.setContext(NavigationContext.chooseAssetContext, 
         // { "triggerPath": path, "serviceFullName": serviceFullName });
            if (this.isWsdlFirst) {
                // const href = `Integrations/Orchestration/Edit/${integrationName}/wsdlFirst/OrchestrationIntegration`;
                // this.router.navigateByUrl(href);
              //   this.integrationEventHandler.routePath = this.routeService.getNg1ProjectName() +
              //  "/Integrations/Orchestration/Edit/" + integrationName + "/wsdlFirst/OrchestrationIntegration";
               // this.integrationEventHandler.checkIsIntegrationLocked(serviceFullName);
            } else if (integrationType) {
                // let href = this.routeService.getNg1ProjectName() + "/Integrations/Edit/" + integrationName + "/integration";
                if (integrationType === "OrchestrationIntegration") {
                  //  href = this.routeService.getNg1ProjectName() + 
                  // "/Integrations/Orchestration/Edit/" + integrationName + "/integration/OrchestrationIntegration";
                }
              //  this.integrationEventHandler.routePath = href;
               // this.integrationEventHandler.checkIsIntegrationLocked(serviceFullName);
            }
        }
    }

    getDocumentSignature(documentTypeNsName) {
        // this.documentEditorsData = null;
        // this.documentTypeService.getDocumentData(documentTypeNsName).subscribe((documentEditorsData) => {
        //     this.documentEditorsData = documentEditorsData;
        // });
    }

    openACLMappingDialog(integrationNsName, event) {
        // TODO not including this functionality
        // event.stopPropagation();
        // this.loaderService.showWithCaption(this.translateService.translate("LOADING"));
        // this.selectedIntegration = integrationNsName;
        // if (this.isaclMappingPermissionPresent) {
        //     forkJoin([this.radDetailsService.getAclList(),
        //     this.radDetailsService.getAssociatedAclForWsdIntegration(this.selectedIntegration, this.wsdName)]).subscribe((response) => {
        //         this.aclList = response[0];
        //         this.associatedACLWithIntegration = response[1];
        //         this.selectedAcl = this.associatedACLWithIntegration;
        //         this.loaderService.hide();
        //         this.showACLModal = true;
        //     }, () => {
        //         this.loaderService.hide();
        //     });
        // } else {
        //     this.getAclMappingForIntegration();
        // }
    }

    onAclSelect(aclObj) {
        this.selectedAcl = aclObj.aclName;
    }

    getAclMappingForIntegration() {
        // this.radDetailsService.getAssociatedAclForWsdIntegration(this.selectedIntegration, this.wsdName).subscribe((response) => {
        //     this.associatedACLWithIntegration = response;
        //     this.loaderService.hide();
        //     this.showACLModal = true;
        // }, (errorResponse) => {
        //     if (errorResponse && errorResponse.error && errorResponse.error.integration && errorResponse.error.integration.message) {
        //         this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
        //     }
        //     this.loaderService.hide();
        // });
    }

    mapAclWithSwaggerFirstIntegration() {
        // this.showACLModal = false;
        // this.loaderService.showWithCaption(this.translateService.translate("SAVING"));
        // this.radDetailsService.mapAclWithSwaggerFirstIntegration(this.getAclIntegrationMapObj()).subscribe((message) => {
        //     this.messageDialogService.show(message, MessageType.success);
        //     this.loaderService.hide();
        // });
    }

    getAclIntegrationMapObj() {
        return {
            integration: {
                serviceData: {
                    aclName: this.selectedAcl,
                    integrationName: this.selectedIntegration,
                    wsdName: this.wsdName
                }
            }
        };
    }

    nodeSelect(event) {
        if (event && event.node && event.node.children && event.node.children[0] &&
             event.node.children[0].label === "Request" && !this.isWsdlFirst) {
            if (this.selectedRow) {
                $(this.selectedRow).removeClass("selected");
            }
            this.selectedRow = $(event.originalEvent.srcElement).parent(".ui-treenode-content");
            $(this.selectedRow).addClass("selected");
        }
    }

    selectedOps(intOpsMap) {
        this.selectedOpsName = intOpsMap.operationName;
    }

    /**
     * To close the modal
     */
    closeAclModalWindow() {
        this.showACLModal = false;
    }

    openIntegrationTypeSelectorDialog() {
        this.wsdOperationName = null;
        this.selectedIntegration = null;
        this.showAddOperartionModal = true;
        this.operationValidationMessage = "";
    }

    updateWsdOperation() {
        this.wsdOperationService.addWsdOperation(this.wsdName, this.getWsdOperationData()).subscribe();
    }

    getWsdOperationData() {
        const wsdOperationData = {
            integration: {
                serviceData: {
                    wsdlOperations: [{
                        "operationName": this.wsdOperationName,
                        "serviceName": this.selectedIntegration
                    }]
                }
            }
        };
        return wsdOperationData;
    }

    addWsdOperationToList() {
        this.showAddOperartionModal = false;
      //  this.loaderService.showWithCaption(this.translateService.translate("LOADING"));
        this.wsdOperationService.addWsdOperation(this.wsdName, this.getWsdOperationData()).subscribe((message) => {
            if (message) {
                this.messageDialogService.show(message, MessageType.success);
            }
            this.operationChange.emit(null);
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error && errorResponse.error.integration && errorResponse.error.integration.message) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
          //  this.loaderService.hide();
        });
    }

    deleteWsdOperation() {
      //  this.loaderService.showWithCaption(this.translateService.translate("LOADING"));
        this.wsdOperationService.deleteWsdOperation(this.wsdName, this.selectedOpsName).subscribe((message) => {
            this.selectedOpsName = null;
            if (message) {
                this.messageDialogService.show(message, MessageType.success);
            }
            this.operationChange.emit(null);
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error && errorResponse.error.integration && errorResponse.error.integration.message) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
         //   this.loaderService.hide();
        });
    }

    isAddOperationButtonDisaled() {
        if (this.wsdOperationName && this.selectedIntegration) {
            return this.operationValidationMessage ? true : false;
        }
        return true;
    }

    validateOperationName() {
        const operationNameValidationRegEx = new RegExp("^[a-zA-Z_0-9]+$", "g");
        if (this.wsdOperationName) {
            if (this.operationsSet.has(this.wsdOperationName)) {
                this.operationValidationMessage = "Operation already exists.";
                return;
            }
            if (!operationNameValidationRegEx.test(this.wsdOperationName.trim())) {
                this.operationValidationMessage = "Only Alphanumeric and underscore characters are allowed.";
                return;
            }
        }
        this.operationValidationMessage = "";
    }

    onIntegrationSelect(integration) {
        if (integration) {
            this.selectedIntegration = integration.name;
        } else {
            this.selectedIntegration = null;
        }
    }

    onIntegrationFieldBlur(integration) {
        this.selectedIntegration = integration;
    }

}
