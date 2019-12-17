import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation, Input, Output, EventEmitter } from "@angular/core";
import { FilterWsdFields } from "./model/wsd-list.model";
import { Subject, Subscription } from "rxjs";
import { MessageDialogService } from "../message-dialog/services/message-dialog.service";
import { WsdListService } from "./services/wsd-list.service";

// import { MessageDialogService } from "../message-dialog/services/message-dialog.service";

// declare var $;

export enum MessageType {
    success = 1,
    danger = 2,
    info = 3,
    warning = 4,
    bulkError = 5
}


@Component({
  //  selector: "wmic-wsd-list",
    templateUrl     : "./wsd-list.component.html",
    styleUrls       : ["./wsd-list.component.scss"],
    encapsulation   : ViewEncapsulation.ShadowDom
})
export class WsdListComponent implements OnInit, AfterViewInit, OnDestroy {

    showChooseWSDTypeModal = false;
    integrationFirst = false;
    wsdlFirst = true;
    wsdList: Array<any> = [];
    projectList = [];
    selectedWsd;
    selectedProject;
    selectedProjectAlias;
    currentStage;
    validationNameMessage = "";
    wsdCopyName;
    isCopyButtonDisabled = true;
    showSearchRow = false;
    filterWsdFields = new FilterWsdFields();
    fromWsdl = false;
    fromScratchType = false;
    showDeleteModal = false;
    showCopyModal = false;
    today = new Date();
    searchByCreatedStartDate: Date;
    searchByModifiedStartDate: Date;
    searchByCreatedEndDate: Date;
    searchByModifiedEndDate: Date;
    isCreatedSearchDateRangeValid = true;
    isModifiedSearchDateRangeValid = true;
    validationMessage = "Please enter valid start and end date.";
    filteredCountSubject = new Subject<number>();
    subscription: Subscription;
    selectedWsdName: string;
    isWsdlFirst = true;
    deployLink;
    deployLinkHtml;
    filterCount = 0;
    activeStage = "stage00";
    filterConfig = {
        strings: [
            {
                attribute: "wsdName",
                index: 0
            },
            {
                attribute: "lastModifiedBy",
                index: 5
            },
            {
                attribute: "createdBy",
                index: 8
            }
        ],
        booleans: [
            {
                attribute: "isWSDLFirst",
                index: 6,
                equateTo: true
            },
            {
                attribute: "isWSDLFirst",
                index: 7,
                equateTo: false
            }
        ],
        dates: [
            {
                attribute: "createdDate",
                filters: [
                    {
                        attribute: "searchByStartDate",
                        index: 1
                    },
                    {
                        attribute: "searchByEndDate",
                        index: 2
                    }
                ]
            },
            {
                attribute: "lastModifiedDate",
                filters: [
                    {
                        attribute: "searchByModifiedStartDate",
                        index: 3
                    },
                    {
                        attribute: "searchByModifiedEndDate",
                        index: 4
                    }
                ]
            }
        ]
    };

    @Input() projectName = "";
    @Input() csrf = "";
    @Output() addnew: EventEmitter<any> = new EventEmitter();
    @Output() gotodet: EventEmitter<any> = new EventEmitter();

    constructor(
        private wsdListService: WsdListService,
        private messageDialogService: MessageDialogService) { }

    ngOnInit() {
      //  document.dispatchEvent(new CustomEvent("HELPLINK", { detail: { displayHelpLabel: "SOAP-APIS", helpLink: "soapapis.html" } }));
       // const previousStage = this.activeStage.getPreviousStage() ?
       // this.activeStage.getPreviousStage().displayName : this.translateService.translate("PREVIOUS");
        // this.deployLinkHtml = this.sanitizer.bypassSecurityTrustHtml(
        //     this.translateService.translateWithArgs("GO-TO-DEPLOY-PAGE-FROM-INTEGRATION-LIST", [previousStage]));
        this.getWsdList();
        this.subscription = this.filteredCountSubject.subscribe((count) => {
            this.filterCount = count;
        });
       // this.currentStage = this.activeStage.getActiveStage();
      //  this.messageDialogService.show("Component Loaded Successfully.", MessageType.success);
    }

    ngAfterViewInit(): void {
        this.deployLink = document.getElementById("deployLink");
        if (this.deployLink) {
            this.deployLink.addEventListener("click", () => {
                this.gotoDeploymentPage();
            });
        }
    }

    getWsdList() {
        // this.wsdList = this.wsdListService.getWsdList();
        this.selectedWsdName = null;
        console.log(`${this.projectName} - ${this.csrf}`);
        this.wsdListService.getWsdList(this.projectName, this.csrf).subscribe((wsdList: any) => {
            this.wsdList = wsdList;
          //  this.loaderService.hide();
        }, (errResponse) => {
            if (errResponse && errResponse.error && errResponse.error.integration && errResponse.error.integration.message.description) {
                this.messageDialogService.show(errResponse.error.integration.message.description, MessageType.danger);
            }
            this.wsdList = [];
           // this.loaderService.hide();
        });
        this.filterCount = (this.wsdList ? this.wsdList.length : 0);
    }

    toggleSearchRow() {
        this.showSearchRow = !this.showSearchRow;
      //  $("#wsdTable").scrollTop(0);
    }

    selectWsdlFist() {
        this.wsdlFirst = true;
        this.integrationFirst = false;
    }

    selectIntegrationFirst() {
        this.wsdlFirst = false;
        this.integrationFirst = true;
    }


    navigateToUpsertWsd() {
        if (this.wsdlFirst) {
        //    this.router.navigate([this.routeService.getNg6ProjectName() + "/wsd/upsert-wsd"]);
        } else {
          //  this.router.navigate([this.routeService.getNg6ProjectName() + "/wsd/upsert-custom-wsd"]);
        }
    }

    editWsd() {
        if (this.isWsdlFirst) {
         //   location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/upsert-wsd/" + this.selectedWsdName;
        } else {
           // location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/upsert-custom-wsd/" + this.selectedWsdName;
        }
    }

    /**
     * Validate whether start date is lesser than end date on selecting either start or end date.
     * @param startDate - start date of the column
     * @param endDate - end date of the column
     * @param column - respective date column
     */
    onDateSelect(startDate, endDate, column) {
        if (startDate && endDate) {
            if (startDate > endDate) {
                if (column === "createdOn") {
                    this.isCreatedSearchDateRangeValid = false;
                } else {
                    this.isModifiedSearchDateRangeValid = false;
                }

            } else {
                if (column === "createdOn") {
                    this.isCreatedSearchDateRangeValid = true;
                } else {
                    this.isModifiedSearchDateRangeValid = true;
                }
            }
        }
    }

    navigateToViewPage(wsdName) {
        this.gotodet.emit(wsdName);
      //  location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/view/" + wsdName;
    }

    navigateToUserInfoPage(userName) {
        location.href = `#/Settings/Users/Info/${userName}`;
    }

    onWsdSelect(wsd) {
        this.selectedWsd = wsd;
        this.selectedWsdName = wsd.wsdName;
        this.isWsdlFirst = wsd.isWSDLFirst;
    }

    deleteWsd() {
     //   this.loaderService.showWithCaption(this.translateService.translate("LOADING"));
        this.wsdListService.deleteWsd(this.selectedWsdName, this.isWsdlFirst, this.projectName, this.csrf).subscribe((message) => {
            if (message) {
                this.messageDialogService.show(message, MessageType.success);
            }
            this.getWsdList();
        }, (errorResponse) => {
            if (errorResponse && errorResponse.error.integration &&
                errorResponse.error.integration.message && errorResponse.error.integration.message.description) {
                this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
            }
           // this.loaderService.hide();
        });
    }

    gotoDeploymentPage() {
        // location.href = "#/Deploy/DeploymentStage/integration";
        // location.href = "#/Deploy/DeploymentStage/wsd";
    }

    validateName(e) {
        this.validationNameMessage = e;
        this.isCopyButtonDisabled = true;
        if (this.validationNameMessage.length === 0 && this.wsdCopyName !== "") {
            this.isCopyButtonDisabled = false;
        }
    }

    setWsdList(radList) {
        this.wsdList = radList || [];
    }

    openCopyWsdModal() {
        this.showCopyModal = true;
        this.validationNameMessage = "";
        this.wsdCopyName = "";
        this.showChooseWSDTypeModal = false;
        this.isCopyButtonDisabled = true;
        // this.projectService.getProjectNames().subscribe(response => {
        //     this.projectList = response;
        //     this.selectedProjectAlias = this.getCurrentProjectAlias();
        //  //   this.modalService.open();
        //   }, errorResponse => {
        //     this.projectList = [];
        //     this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
        //   });
    }

    closeModalWindow() {
        this.showCopyModal = false;
        // this.modalService.close();
    }

    getCurrentProjectAlias() {
        // this.selectedProject = this.projectService.getProjectSelected;
        // for (let i = 0; i < this.projectList.length; i++) {
        //     if (this.projectList[i].name === this.selectedProject) {
        //         return this.projectList[i].alias ? this.projectList[i].alias : this.projectList[i].name;
        //     }
        // }
      }

    copySelectedWsd() {
    //     this.closeModalWindow();
    //  //   this.loaderService.showWithCaption("Copying...");
    //         this.wsdListService.copyWsdAcrossProjects(this.selectedWsd.wsdFullName,
    //          this.wsdCopyName, this.selectedProject, this.currentStage.id).subscribe((response) => {
    //             this.wsdListService.getWsdList().subscribe((radList) => {
    //                 this.setWsdList(radList);
    //                 this.selectedWsdName = "";
    //                // this.loaderService.hide();
    //             });
    //             if (response && response.integration && response.integration.message) {
    //                 this.messageDialogService.show(response.integration.message.description, MessageType.success);
    //             }
    //         }, (errorResponse) => {
    //            // this.loaderService.hide();
    //             if (errorResponse && errorResponse.error && errorResponse.error.integration && errorResponse.error.integration.message) {
    //                 this.messageDialogService.show(errorResponse.error.integration.message.description, MessageType.danger);
    //             }
    //         });
    }

    onProjectSelect(event) {
        this.validationNameMessage = "";
        if (event) {
            this.selectedProject = event.name;
            this.wsdCopyName = "";
            this.isCopyButtonDisabled = true;
        } else {
            this.isCopyButtonDisabled = true;
        }
    }

    disableCopyButton(e) {
        this.validationNameMessage = "";
        this.isCopyButtonDisabled = false;
    }


    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    addNew() {
       this.addnew.emit("Add New");
    }
}
