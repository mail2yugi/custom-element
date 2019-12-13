import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { WsdApiService } from "src/app/shared/services/wsd-api.services";

@Injectable({providedIn: "root"})
export class WsdOperationService {

    constructor(private wsdApiService: WsdApiService) { }

    addWsdOperation(wsdName, wsdData) {
        return this.wsdApiService.addWsdOperation(wsdName, wsdData).pipe(map((response: any) => {
            if (response && response.integration && response.integration.message && response.integration.message.description) {
                return response.integration.message.description;
            }
            return null;
        }));
    }

    updateWsdOperation(wsdName, wsdData) {
        return this.wsdApiService.updateWsdOperation(wsdName, wsdData).pipe(map((response: any) => {
            if (response && response.integration && response.integration.message && response.integration.message.description) {
                return response.integration.message.description;
            }
            return null;
        }));
    }

    deleteWsdOperation(wsdName, wsdOperationName) {
        return this.wsdApiService.deleteWsdOperation(wsdName, wsdOperationName).pipe(map((response: any) => {
            if (response && response.integration && response.integration.message && response.integration.message.description) {
                return response.integration.message.description;
            }
            return null;
        }));
    }

}
