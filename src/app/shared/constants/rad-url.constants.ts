
export class RadUrls {
    public static get getActiveStages() {
        return "rest/stage?checkIfStagesAreFunctional=false&onlyAccessibleStages=true";
    }

    public static get getCreateRadWithSwaggerFirst() {
        return "rest/rad?creationMethod=SWAGGER_FIRST";
    }

    public static get getUpdateRadWithSwaggerFirst() {
        return "rest/rad?creationMethod=SWAGGER_FIRST_REFRESH";
    }

    public static get getCreateRadWithIntegrationFirst() {
        return "rest/rad?creationMethod=INTEGRATION_FIRST";
    }

    public static get getCopyRad() {
        return "rest/rad/saveAs/";
    }

    public static get getCopyRadAcrossProjectsUrl() {
        return "rest/deploy/";
    }

    public static get getRadList() {
        return "rest/rad";
    }

    public static get getRadDetails() {
        return "rest/rad/";
    }

    public static get previewRadDetails() {
        return "rest/rad/preview/";
    }

    public static get getSwaggerDocument() {
        return "rest/rad/swagger/";
    }

    public static get getIntegrationNames() {
        return "integration/rest/assembly/stage?stageName=";
    }

    public static get getRadListUrl() {
        return "rad/list";
    }
    public static get getRadAddUrl() {
        return "rad/add";
    }

    public static get getRadViewUrl() {
        return "rad/view/";
    }

    public static get getResourcePathValidationUrl() {
        return "/integration/rest/validate/validateRADPath";
    }

    public static get getExportRadsUrl() {
        return "rest/service/export";
    }

    public static get getRadListFromZipArchieveUrl() {
        return "rest/assembly/import";
    }

    public static get saveRadListOnImportUrl() {
        return "rest/assembly/import/services";
    }

    public static get getAclList() {
        return "rest/acl";
    }

    public static get mapAclWithSwaggerFirstIntegration() {
        return "rest/acl/integration";
    }

    public static get getAssociatedAclForIntegration() {
        return "rest/acl/integration";
    }
}
