import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, of } from "rxjs";
import { map } from "rxjs/operators";
import { UrlConstants } from "../constants/url-constants";


@Injectable({providedIn: "root"})
export class ActiveStageService {
    deletedUserIds = [];
    accessibleStages: Stage[];
    currentStage: Stage;
    stateChanged = new Subject<Stage>();

    constructor(private httpClient: HttpClient) {
    }

    getActiveStage(): Stage {
        return this.currentStage;
    }
    setActiveStage(currentStage: Stage): void {
        if (currentStage) {
            this.currentStage = currentStage;
            this.stateChanged.next(currentStage);
        }
    }

    getPreviousStage(): Stage {
        if (this.currentStage && this.accessibleStages) {
            const accessibleStages = this.accessibleStages;
            let currentStageIndex = 0;
            for (let i = 0; i < accessibleStages.length; i++) {
                if (accessibleStages[i].id === this.currentStage.id) {
                    currentStageIndex = i;
                    break;
                }
            }
            return accessibleStages[currentStageIndex - 1];
        }
    }

    getNextStage(): Stage {
        if (this.currentStage && this.accessibleStages) {
            const accessibleStages = this.accessibleStages;
            let currentStageIndex = 0;
            for (let i = 0; i < accessibleStages.length; i++) {
                if (accessibleStages[i].id === this.currentStage.id) {
                    currentStageIndex = i;
                    break;
                }
            }
            if (accessibleStages[currentStageIndex + 1]) {
                return accessibleStages[currentStageIndex + 1];
            }
            return null;
        }
    }

    /**
     * This function will check for the stage present in the URL
     * If the stage in URL is different from the current stage, it will set the stage from URL
     * @param stageResponse : response got from getUserSelectedStageInUI
     */
    changeActiveStage(stageResponse: StageResponse): Observable<any> {
        const urlStage = this.getStageNameFromURL();
        if (stageResponse.userSelectedStageInUI && stageResponse.accessibleStages) {
            const currentStageName = stageResponse.userSelectedStageInUI.displayName;
            this.accessibleStages = stageResponse.accessibleStages;
            const filteredStage = stageResponse.accessibleStages.filter( (item, index) => {
                return (item.id === urlStage);
            });
            if (urlStage && currentStageName !== urlStage && filteredStage.length > 0) {
                const currentStage: Stage = {
                    id: urlStage,
                    displayName: ""
                };
                return this.saveActiveStage(currentStage);
            } else {
                this.setActiveStage(stageResponse.userSelectedStageInUI);
                return of("");
            }
        }
    }

    /**
     * This function is used to set selected stage in UI
     * @param currentStage - current stage
     */
    saveActiveStage(currentStage): Observable<any> {
        if (currentStage && currentStage.id) {
            return this.httpClient.put(UrlConstants.setUserSelectedStageInUI + currentStage.id, {}).
            pipe(map((setUserSelectedStageInUiResponse) => {
                switch (currentStage.id) {
                    case "stage00":
                        currentStage.displayName = "Development";
                        break;
                    case "stage01":
                        currentStage.displayName = "Test";
                        break;
                    case "stage02":
                        currentStage.displayName = "Pre Live";
                        break;
                    case "stage99":
                        currentStage.displayName = "Live";
                        break;
                }
                this.setActiveStage(currentStage);
            }));
        }
    }

    /**
     * This function is used to get the stage name from the URL
     */
    getStageNameFromURL() {
        let stageParam = "";

        if (localStorage.getItem("lastStageFromUrl")) {
            stageParam = localStorage.getItem("lastStageFromUrl");
            localStorage.removeItem("lastStageFromUrl");
            return stageParam;
        } else {
            const hash = this.getLinkWithoutHash();
            const stageParamConfigs = StageParamConstants.getStageUrlConfigs;
            stageParamConfigs.forEach((stageParamConfig) => {
                if (hash.indexOf(stageParamConfig.basePathParam) > -1) {
                    const routeParams = hash.split("/");
                    stageParam = routeParams[stageParamConfig.index];
                    if (stageParam && stageParam.indexOf("stage") > -1) {
                        return stageParam;
                    }
                }
            });
        }

        return stageParam;
    }

    getLocationHash() {
        return location.hash;
    }

    getLinkWithoutHash(href?) {
        const link = href ? href : this.getLocationHash();
        const lastIndex = link.lastIndexOf("#/");
        if (lastIndex > -1) {
            return link.substring(lastIndex + 2);
        } else {
            return link;
        }
    }

    getStageChanged() {
        return this.stateChanged.pipe(map((stage) => {
            if (stage) {
                this.currentStage = stage;
                return this.currentStage;
            }
        }));
    }

    setDeletedUserIds(userIds) {
        this.deletedUserIds = userIds;
    }

    getDeletedUserIds() {
        return this.deletedUserIds;
    }

    isUserDeleted(userId) {
        if (this.getDeletedUserIds().length > 0 && this.getDeletedUserIds().includes(userId)) {
            return true;
        }
        return false;
    }
}

export interface Stage {
    id: string;
    displayName: string;
}

export interface StageConfigParam {
    basePathParam: string;
    index: number;
}

export class StageParamConstants {
    public static get getStageUrlConfigs(): Array<StageConfigParam> {
        return [{
            basePathParam: "Monitor/Result/",
            index: 4
        }];
    }
}

export enum StageId {
    development = "stage00",
    test = "stage01",
    preLive = "stage02",
    live = "stage99"
}

export const StageDetails = {
    [StageId.development]: {
        stageId: "stage00",
        stageName: "development",
        stageDisplayName: "DEVELOPMENT"
    },
    [StageId.test]: {
        stageId: "stage01",
        stageName: "test",
        stageDisplayName: "TEST"
    },
    [StageId.preLive]: {
        stageId: "stage02",
        stageName: "prelive",
        stageDisplayName: "PRELIVE"
    },
    [StageId.live]: {
        stageId: "stage99",
        stageName: "live",
        stageDisplayName: "LIVE"
    }
};

export interface StageResponse {
    accessibleStages: Stage[];
    userSelectedStageInUI: Stage;
}
