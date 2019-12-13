import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable} from "rxjs";
import { RadApiService } from "./rad-api.service";

@Injectable({providedIn: "root"})
export class RestOperationService {
    integrationList = [];
    constructor(private radApiService: RadApiService) {

    }

    getIntegrationNames(prjName, cxrc): Observable<any> {
        return this.radApiService.getIntegrationNames("stage00", prjName, cxrc).pipe(map((response) => {
            if (response && response.integration && response.integration.serviceData &&
                response.integration.serviceData.integrationService) {
                this.integrationList = response.integration.serviceData.integrationService;
                return this.integrationList;
            } else {
                return [];
            }
        }));
    }

    updateRadDetails(requestBody): Observable<any> {
        return this.radApiService.updateRadDetails(requestBody);
    }

    getRadDetails(radName): Observable<any> {
        return this.radApiService.getRadDetails(radName).pipe(map((response) => {
            if (response && response.integration && response.integration.serviceData) {
                return response.integration.serviceData;
            } else {
                return null;
            }
        }));
    }

    getValidationForOperationPath(asset): Observable<any> {
        return this.radApiService.getResourcePathValidated(asset);
    }
}
