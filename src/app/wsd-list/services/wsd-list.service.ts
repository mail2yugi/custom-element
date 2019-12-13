import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { WsdApiService } from "src/app/shared/services/wsd-api.services";

@Injectable({providedIn: "root"})
export class WsdListService {

    constructor(private wsdApiService: WsdApiService) { }

    getWsdList(prjName, cxrc): Observable<any> {
        return this.wsdApiService.getWsdList(prjName, cxrc).pipe(map((response: any) => {
            if (response &&  response.integration && response.integration.serviceData
                && response.integration.serviceData.webServiceDescriptors) {
                return response.integration.serviceData.webServiceDescriptors;
            }
            return [];
        }));
    }

    deleteWsd(wsdName, isWSDLFirst, prjName, cxrc) {
        return this.wsdApiService.deleteWsd(wsdName, isWSDLFirst, prjName, cxrc).pipe(map((response: any) => {
            if (response && response.integration && response.integration.message && response.integration.message.description) {
                return response.integration.message.description;
            }
            return null;
        }));
    }

    copyWsdAcrossProjects(originalName, newName, toProjectName, currentStage): Observable<any> {
        return this.wsdApiService.copyWsdAcrossProjects(originalName, newName, toProjectName, currentStage);

    }
}
