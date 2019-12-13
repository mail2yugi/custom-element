import { Component, Input } from "@angular/core";
import { DateTimeService } from "src/app/shared/services/date-time.service";
import { ActiveStageService } from "src/app/shared/services/active-stage.service";

@Component({
    selector: "app-wsd-overview",
    templateUrl: "./wsd-overview.component.html"
})
export class WsdOverviewComponent {

    @Input() wsdDetails;

    constructor(
        public activeStage: ActiveStageService,
        public dateTimeService: DateTimeService) {
            const a = this.activeStage.getActiveStage();
            console.log(":::::::::::::::::::::::::" + a);
        }


    navigateToCreatedByUserProfile() {
       // this.routeService.navigateTo("Settings/Users/Info/" + this.wsdDetails.node_hints.revisionData.createdByUserId);
    }

    navigateToModifiedByUserProfile() {
       // this.routeService.navigateTo("Settings/Users/Info/" + this.wsdDetails.node_hints.revisionData.lastModifiedByUserId);
    }

    editWsdOverview() {
        if (this.wsdDetails && this.wsdDetails.node_nsName) {
            const wsdName = this.wsdDetails.node_nsName.split(":")[1];
            localStorage.setItem("wsdActiveTabIndex", "0");
            localStorage.setItem("wsdNavigationLink",
            JSON.stringify({ linkText: wsdName, linkUrl : "/wsd/view/" + wsdName}));
            if (this.wsdDetails.isWSDLFirst) {
                // location.href = `#/project/${this.projectName}/wsd/upsert-wsd/${wsdName}`;
               // location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/upsert-wsd/" + wsdName;
            } else {
                // location.href = `#/project/${this.projectName}/wsd/upsert-custom-wsd/${wsdName}`;
              //  location.href = "#/" + this.routeService.getNg6ProjectName() + "/wsd/upsert-custom-wsd/" + wsdName;
            }
        }
    }

}
