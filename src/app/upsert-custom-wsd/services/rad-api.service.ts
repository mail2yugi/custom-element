import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RadUrls } from "src/app/shared/constants/rad-url.constants";


@Injectable({providedIn: "root"})
export class RadApiService {
    constructor(private httpClient: HttpClient) { }

    getActiveStages(): Observable<any> {
        return this.httpClient.get(RadUrls.getActiveStages);
    }

    createRadWithSwaggerFirst(formData): Observable<any> {
        return this.httpClient.post(RadUrls.getCreateRadWithSwaggerFirst, formData);
    }

    updateRadWithSwaggerFirst(formData): Observable<any> {
        return this.httpClient.post(RadUrls.getUpdateRadWithSwaggerFirst, formData);
    }

    createRadWithIntegrationFirst(formData): Observable<any> {
        return this.httpClient.post(RadUrls.getCreateRadWithIntegrationFirst, formData);
    }

    copyRad(radName, radCopyName): Observable<any> {
        return this.httpClient.post(RadUrls.getCopyRad + radName + "?newRADName=" + radCopyName, {});
    }

    copyRadAcrossProjects(originalName, newName, toProjectName, currentStage): Observable<any> {
        return this.httpClient.post(RadUrls.getCopyRadAcrossProjectsUrl + originalName + "/?newServiceName=" + newName +
        "&toProjectName=" + toProjectName + "&fromStage=" + currentStage + "&toStage=" + currentStage, {});
    }

    getRadList(): Observable<any> {
        return this.httpClient.get(RadUrls.getRadList);
    }

    getRadDetails(radName): Observable<any> {
        return this.httpClient.get(RadUrls.getRadDetails + radName);
    }

    previewRadDetails(radFullName): Observable<any> {
        return this.httpClient.get(RadUrls.previewRadDetails + radFullName + "/");
    }

    updateRadDetails(requestBody): Observable<any> {
        return this.httpClient.put(RadUrls.getRadList, requestBody);
    }

    deleteSelectedRad(radName, isSwaggerFirst): Observable<any> {
        return this.httpClient.delete(RadUrls.getRadDetails + radName + "?stageName=stage00&isSwaggerFirst=" + isSwaggerFirst);
    }

    getSwaggerDocument(radName): Observable<any> {
        return this.httpClient.get(RadUrls.getSwaggerDocument + radName);
    }

    getIntegrationNames(stageName, prjName, cxrc): Observable<any> {
      //  return this.httpClient.get(RadUrls.getIntegrationNames + stageName + "&nameOnly=true", {headers: {"x-csrf-token": cxrc}});
        const urlinte = `${RadUrls.getIntegrationNames}${stageName}&nameOnly=true&projectName=${prjName}`;
        return this.httpClient.get(urlinte, {headers: {"x-csrf-token": cxrc}});
    }

    getResourcePathValidated(asset): Observable<any> {
        return this.httpClient.post(RadUrls.getResourcePathValidationUrl, asset);
    }

    exportRads(serviceData): Observable<any> {
        return this.httpClient.post(RadUrls.getExportRadsUrl, serviceData, { observe: "response", responseType: "blob" });
    }

    getRadListFromZipArchieve(formData): Observable<any> {
        return this.httpClient.post(RadUrls.getRadListFromZipArchieveUrl + "?assetType=RESTAPI", formData);
    }

    saveRadsOnImport(requestBody): Observable<any> {
        return this.httpClient.post(RadUrls.saveRadListOnImportUrl, requestBody);
    }

    getAclList(): Observable<any> {
        return this.httpClient.get(RadUrls.getAclList);
    }

    mapAclWithSwaggerFirstIntegration(aclIntegrationMapObj): Observable<any>  {
        return this.httpClient.post(RadUrls.mapAclWithSwaggerFirstIntegration, aclIntegrationMapObj);
    }

    getAssociatedAclForIntegration(integrationName, radName): Observable<any> {
        return this.httpClient.get(RadUrls.getAssociatedAclForIntegration + "?integrationName=" + integrationName + "&radName=" + radName );
    }

    getAssociatedAclForWsdIntegration(integrationName, wsdName): Observable<any> {
        return this.httpClient.get(RadUrls.getAssociatedAclForIntegration + "?integrationName=" + integrationName + "&wsdName=" + wsdName );
    }
}
