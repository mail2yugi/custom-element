import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class CommonUtlilityService {

    getServiceData(data) {
        if (data && data.integration && data.integration.serviceData) {
            return data.integration.serviceData;
        }
        return null;
    }

    getMessageDescription(data): string {
        if (data && data.integration && data.integration.message && data.integration.message.description) {
            return data.integration.message.description;
        }
        return null;
    }
}
