import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { WsdApiService } from "../../shared/services/wsd-api.services";
import { CommonUtlilityService } from "./common-utililty.service";

@Injectable({providedIn: "root"})
export class UpsertCustomWsdService {

    constructor(
        private wsdApiService: WsdApiService,
        private commonUtlilityService: CommonUtlilityService) { }

    createIntegrationFirstWsd(wsdData, projectName, cxrc): Observable<any> {
        return this.wsdApiService.createIntegrationFirstWsd(wsdData, projectName, cxrc).pipe(map((response: any) => {
             return this.commonUtlilityService.getMessageDescription(response);
        }));
    }

    updateIntegrationFirstWsd(wsdName, wsdData): Observable<any> {
        return this.wsdApiService.updateIntegrationFirstWsd(wsdName, wsdData).pipe(map((response: any) => {
            return this.commonUtlilityService.getMessageDescription(response);
        }));
    }

    updateOperstion(wsdName, wsdData): Observable<any> {
        return this.wsdApiService.updateOperstion(wsdName, wsdData).pipe(map((response: any) => {
            return this.commonUtlilityService.getMessageDescription(response);
        }));
    }

}
