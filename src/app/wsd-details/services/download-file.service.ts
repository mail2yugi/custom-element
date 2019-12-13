import { Injectable } from "@angular/core";
declare var $;

@Injectable({providedIn: "root"})
export class DownloadFileService {

    save(file, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
            // IE specific download.
            navigator.msSaveBlob(file, fileName);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.setAttribute("href", window.URL.createObjectURL(file));
            downloadLink.setAttribute("download", fileName);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }
}
