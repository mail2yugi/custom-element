import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WsdUrls } from "../constants/wsd-url.constants";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class WsdApiService {

    constructor(private http: HttpClient) { }

    createWsdWithWsdlFirst(wsdData) {
        return this.http.post(`${WsdUrls.getWsdDetails}?creationType=${WSD_CREATIONTYPE.WSDL_FIRST}`, wsdData);
    }

    getWsdlXml(wsdlName, prjName, cxrc) {
        return this.http.get(`${WsdUrls.getWsdlXml}/${wsdlName}?projectName=${prjName}`, {headers: {"x-csrf-token": cxrc}});
    }

    getWsdList(prjName, cxrc) {
        return this.http.get(`${WsdUrls.getWsdDetails}?projectName=${prjName}`, {headers: {"x-csrf-token": cxrc}});
    }

    getWsdDetails(wsdName, prjName, cxrc) {
        return this.http.get(`${WsdUrls.getWsdDetails}/${wsdName}?projectName=${prjName}`, {headers: {"x-csrf-token": cxrc}});
    }

    deleteWsd(wsdName, isWSDLFirst, prjName, cxrc) {
        const delWsdUrl = `${WsdUrls.getWsdDetails}/${wsdName}?isWSDLFirst=${isWSDLFirst}&projectName=${prjName}`;
        return this.http.delete(delWsdUrl, {headers: {"x-csrf-token": cxrc}});
    }

    updateWsd(wsdName, wsdData) {
        return this.http.put(`${WsdUrls.getWsdDetails}/${wsdName}?creationType=REFRESH_WSDL_FIRST`, wsdData);
    }

    createIntegrationFirstWsd(wsdData, projectName, cxrc) {
        return this.http.post(`${WsdUrls.getWsdDetails}?creationType=INTEGRATION_FIRST&projectName=${projectName}`,
        wsdData, {headers: {"x-csrf-token": cxrc}});
    }

    updateIntegrationFirstWsd(wsdName, wsdData) {
        return this.http.put(`${WsdUrls.getWsdDetails}/${wsdName}?creationType=INTEGRATION_FIRST`, wsdData);
    }

    updateOperstion(wsdName, wsdData) {
        return this.http.put(`${WsdUrls.getWsdDetails}/addOperation/${wsdName}?creationType=INTEGRATION_FIRST`, wsdData);
    }

    addWsdOperation(wsdName, wsdData) {
        return this.http.post(`${WsdUrls.getWsdDetails}/operation/${wsdName}?creationType=INTEGRATION_FIRST`, wsdData);
    }

    updateWsdOperation(wsdName, wsdData) {
        return this.http.put(`${WsdUrls.getWsdDetails}/operation/${wsdName}?creationType=INTEGRATION_FIRST`, wsdData);
    }

    deleteWsdOperation(wsdName, wsdOperationName) {
        return this.http.delete(`${WsdUrls.getWsdDetails}/operation/${wsdName}/${wsdOperationName}?isWSDLFirst=false`);
    }

    copyWsdAcrossProjects(originalName, newName, toProjectName, currentStage): Observable<any> {
        return this.http.post(WsdUrls.getCopyWsdAcrossProjectsUrl + originalName +
            "/?newServiceName=" + newName + "&toProjectName=" + toProjectName + "&fromStage=" +
            currentStage + "&toStage=" + currentStage, {});
    }
}

enum WSD_CREATIONTYPE {
    WSDL_FIRST = "WSDL_FIRST",
    INTEGRATION_FIRST = "INTEGRATION_FIRST"
}
