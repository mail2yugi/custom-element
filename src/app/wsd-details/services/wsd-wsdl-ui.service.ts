import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { WsdApiService } from "src/app/shared/services/wsd-api.services";

@Injectable({providedIn: "root"})
export class WsdWsdlUiService {

    constructor(private wsdApiService: WsdApiService) {}

    getWsdlXml(wsdlName, prjName, cxrc) {
        return this.wsdApiService.getWsdlXml(wsdlName, prjName, cxrc).pipe(map((response: any) => {
            if (response && response.integration && response.integration.serviceData && response.integration.serviceData.wsdlString) {
                return response.integration.serviceData.wsdlString;
            }
            return null;
        }));
    }
}
