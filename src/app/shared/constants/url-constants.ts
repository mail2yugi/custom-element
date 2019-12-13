
export class UrlConstants {
    public static get getValidateName() {
        return "rest/validate/validateName";
    }

    public static get getSolutionValidateNameUrl() {
        return "rest/landscapes/solution/validate";
    }

    public static get getUserInfo() {
        return "rest/user/info";
    }

    public static get getAvailableStages() {
        return "rest/stage?checkIfStagesAreFunctional=false&onlyAccessibleStages=false";
    }
    public static get getAccessStages() {
        return "rest/stage?checkIfStagesAreFunctional=false&onlyAccessibleStages=true";
    }

    public static get accessProfile() {
        return "rest/accessProfile/";
    }

    public static get getTenantCapabilities() {
        return "rest/tenant/capabilities";
    }
    public static get getUserPasswordStatus() {
        return "rest/password/status";
    }

    public static get getUserTimezoneList() {
        return "live/rest/utility/timeZone";
    }

    public static get getActiveUserCount() {
        return "rest/user/active/count";
    }

    public static get getUserSelectedStageInUI() {
        return "rest/stage/userSelectedStageInUI";
    }

    public static get setUserSelectedStageInUI() {
        return "rest/stage/userSelectedStageInUI?stageName=";
    }

    public static get getDeletedUserList() {
        return "rest/user/list";
    }

    public static get getUserPreferences() {
        return "rest/preferences/users/me";
    }

    public static get setUserPreference() {
        return "rest/preferences/users/me";
    }

    public static get getImageForProvider() {
        return "rest/application/resources/image/";
    }

    public static get getFeatureConfigProperties() {
        return "rest/features";
    }

    public static get getAccessProfilesUrl() {
        return "rest/accessProfile";
    }

    public static get getSagCloudHomePageUrl() {
        return "rest/sagcloud/getSAGCloudTenantHomePageUrl";
    }

    public static get getCloudDeploymentStatusUrl() {
        return "rest/cloudDeployment/status";
    }

    public static get enableCloudDeploymentUrl() {
        return "rest/cloudDeployment/enable";
    }

    public static get getFeatureConfigPropertiesBeforeLogin() {
        return "rest/ua/features";
    }

    public static get getSagCloudProductList() {
        return "rest/sagcloud/product-list";
    }

    public static get getProjectCapabilities() {
        return "rest/functionalRole/projectCapabilities/all";
    }

    public static get getICFeatureListUrl() {
        return "rest/features";
    }

}
