import { Injectable } from "@angular/core";
import { WsdApiService } from "../../shared/services/wsd-api.services";
import { map } from "rxjs/operators";

@Injectable({providedIn: "root"})
export class WsdDetailsService {

    constructor(private wsdApiService: WsdApiService) { }

    getWsdDetails(wsdName, prjName, cxrc) {
        return this.wsdApiService.getWsdDetails(wsdName, prjName, cxrc).pipe(map((response: any) => {
            if (response && response.integration && response.integration.serviceData) {
                return response.integration.serviceData;
            }
            return null;
        }));
    }

    getName(fullName) {
        if ( fullName ) {
            if ( fullName.indexOf(":") > -1 ) {
                return fullName.split(":")[1];
            } else {
                return fullName;
            }
        }
        return "";
    }

    generateOperationTree(wsdOperations): any {
        const treeNodes: any = [];
        wsdOperations.forEach(operation => {
            treeNodes.push({
                label: operation.operationName,
                data: {
                    serviceFullName: operation.serviceName,
                    integrationName: this.getName(operation.serviceName),
                    paddingLeft: "15px"
                },
                children: [{
                    label: "Request",
                    children: [{
                        label : "Header",
                        children: [],
                        data: {
                            paddingLeft: "15px"
                        }
                    }, {
                        label : "Body",
                        data: {
                                documentType: this.getName(operation.requestElement.body.docType)
                        }
                    }]
                }, {
                    label: "Response",
                    children: [{
                        label : "Header",
                        children: []
                    }, {
                        label : "Body",
                        data: {
                            documentType: this.getName(operation.responseElement.body.docType)
                        }
                    }, {
                        label : "Fault",
                        children: []
                    }]
                }]
            });
        });
        return treeNodes;
    }

    generateOperationTreeForIntegrationFirst(wsdOperations): any {
        const treeNodes: any[] = [];
        wsdOperations.forEach(operation => {
            treeNodes.push({
                label: operation.operationName,
                data: {
                    serviceFullName: operation.serviceName,
                    integrationName: this.getName(operation.serviceName),
                    paddingLeft: "15px"
                },
                children: [{
                    label: "Request",
                    children: [{
                        label : "Header",
                        children: [],
                        data: {
                            paddingLeft: "15px"
                        }
                    }]
                }, {
                    label: "Response",
                    children: [{
                        label : "Fault",
                        children: []
                    }]
                }]
            });
        });
        return treeNodes;
    }

}
