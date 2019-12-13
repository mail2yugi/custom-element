import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { DownloadFileService } from "../services/download-file.service";

@Component({
    selector: "app-wsd-wsdl-ui",
    templateUrl: "./wsd-wsdl-ui.component.html",
    styleUrls: ["./wsd-wsdl-ui.component.scss"]
})
export class WsdWsdlUiComponent implements OnInit {
    editorOptions = { showPrintMargin : false, fontSize: "14px", wrap: true, wrapBehavioursEnabled: true};
    @Input() wsdlXml;
    @Input() wsdName;
    fileExtention = ".xml";
    // @Input() set wsdDetails(details) {
    //     if (details) {
    //         this.wsdName = details.node_nsName.split(":")[1];
    //         this.getWsdlFile();
    //     }
    // }

    constructor(private downloadFileService: DownloadFileService) {}

    ngOnInit() {
    }

    downloadSwagger() {
        if (this.wsdName && this.wsdlXml) {
            const downloadFileName = this.wsdName + this.fileExtention;
            const blob = new Blob([this.wsdlXml], { type: "application/xml" });
            this.downloadFileService.save(blob, downloadFileName);
        }
    }
}
