
import { Injectable } from "@angular/core";
declare var moment;

@Injectable({providedIn: "root"})
export class DateTimeService {

    private userRegion: string;
    private dateFormat: string;
    private timeFormat: string;
    private timeFormatWithoutSecond: string;
    static getOffset(): any {
        throw new Error("Method not implemented.");
    }

    constructor() { }

    formatDateTimeWithUserTimeZone(dateStr) {
        const date = Number(dateStr);
        this.userRegion = this.getUserRegion();
        this.dateFormat = this.getDateFormat();
        this.timeFormat = this.getTimeFormat();


        if (date && this.dateFormat && this.timeFormat) {
            const format = this.dateFormat.toUpperCase() + " " + this.timeFormat;

            const abbr = moment(date).tz(this.userRegion).format(" z");
            let returnDateTime = moment(date).tz(this.userRegion).format(format + " z");
            if (abbr.indexOf("+") > -1 || abbr.indexOf("-") > -1) {
                returnDateTime = moment(date).tz(this.userRegion).format(format) + " GMT " + moment().tz(this.userRegion).format("Z");
            }
            return returnDateTime;
        }
    }

    /*
			This function is used by whole UI to just show the date and time in formatted way.
		*/
    formatDate(date, ignoreSecond, dateOnly) {
        this.userRegion = this.getUserRegion();
        this.dateFormat = this.getDateFormat();
        this.timeFormat = this.getTimeFormat();
        if (date) {
            if (this.dateFormat && this.timeFormat) {
                let format = this.dateFormat.toUpperCase() + " " + this.timeFormat;
                if (ignoreSecond) {
                    format = this.dateFormat.toUpperCase() + " " + this.timeFormatWithoutSecond;
                }

                const abbr = moment(date).tz(this.userRegion).format(" z");
                let returnDateTime = moment(date).tz(this.userRegion).format(format + " z");
                if (abbr.indexOf("+") > -1 || abbr.indexOf("-") > -1) {
                    returnDateTime = moment(date).tz(this.userRegion).format(format) + " GMT " + moment().tz(this.userRegion).format("Z");
                }

                if (dateOnly) {
                    return returnDateTime.split(" ", 1)[0];
                }

                return returnDateTime;
            }
        }
    }

    formatDateTimeWithUserTimeZoneCustomDateTimeFormat(dateStr: any, customDateTimeFormat: string) {
        const date = Number(dateStr);
        this.userRegion = this.getUserRegion();
        const dateTimeFormat = customDateTimeFormat;


        if (date && dateTimeFormat) {
            const format = dateTimeFormat;

            const abbr = moment(date).tz(this.userRegion).format(" z");
            let returnDateTime = moment(date).tz(this.userRegion).format(format);
            if (abbr.indexOf("+") > -1 || abbr.indexOf("-") > -1) {
                returnDateTime = moment(date).tz(this.userRegion).format(format);
            }
            return returnDateTime;
        }
    }


    setDateFormat(data) {
        this.dateFormat = localStorage.getItem("dateFormat");

    }
    setTimeFormat() {
        this.timeFormat = localStorage.getItem("timeFormat");
    }
    getUserRegion() {
        return localStorage.getItem("userRegion");
    }
    getDateFormat() {
        return localStorage.getItem("dateFormat");
    }
    getTimeFormat() {
        return localStorage.getItem("timeFormat");
    }
    getBeforeTimeFromCurrentTime(timeOffset) {
        const offset = timeOffset * 60 * 60 * 1000;
        const offsetTime = this.getCurrentUtcTime() - offset;
        return offsetTime;
    }
    getCurrentUtcTime() {
        return this.getUTCFromUserTimeForCalendar(moment(this.getCurrentUserDate() + (this.getOffsetInMilliseconds()))).valueOf();
    }

    getUTCFromUserTime = function (timeStamp) {
    return this.getUTCFromUserTimeForCalendar(timeStamp).valueOf();
};

getUTCFromUserTimeForCalendar(date) {
    const localOffsetObj = this.getUserTimeOffsets(date);
    // move the time to GMT
    // if offset is +10 hrs, we need to reduce 10 to get GMT time
    let gmtMoment;
    if (localOffsetObj.userAheadGmt) {
        gmtMoment = moment(date).subtract(Math.abs(localOffsetObj.userHrsOffset), "hour").subtract(Math.abs(localOffsetObj.userMinsOffset), "minute");
    } else {
        gmtMoment = moment(date).add(Math.abs(localOffsetObj.userHrsOffset), "hour").add(Math.abs(localOffsetObj.userMinsOffset), "minute");
    }
    // move the time to local
    if (localOffsetObj.localAheadGmt) {
        date = moment(gmtMoment).add(localOffsetObj.localHrsOffset, "hour").add(localOffsetObj.localMinsOffset, "minute");
    } else {
        date = moment(gmtMoment).subtract(Math.abs(localOffsetObj.localHrsOffset), "hour").subtract(localOffsetObj.localMinsOffset, "minute");
    }
    return date;
}
getUserTimeOffsets(date): OffsetObject {
    const offsetObj = new OffsetObject();
    const userZoneDifference = moment.tz(date, this.getUserRegion()).format("Z");
    offsetObj.userAheadGmt = userZoneDifference.charAt(0) === "+";
    let split = userZoneDifference.split(":");
    offsetObj.userHrsOffset = parseInt(split[0], 10);
    offsetObj.userMinsOffset = parseInt(split[1], 10);
    // move the time to local
    const local_zoneDifference = moment().format("Z");
    offsetObj.localAheadGmt = local_zoneDifference.charAt(0) === "+";
    split = local_zoneDifference.split(":");
    offsetObj.localHrsOffset = parseInt(split[0], 10);
    offsetObj.localMinsOffset = parseInt(split[1], 10);
    return offsetObj;
}
getCurrentUserDate() {
    return moment().tz(this.getUserRegion());
}
getOffsetInMilliseconds() {
    const localOffsetObj = this.getUserTimeOffsets(new Date());
    const hrs_offset = localOffsetObj.userHrsOffset - localOffsetObj.localHrsOffset;
    const mins_offset = localOffsetObj.userMinsOffset - localOffsetObj.localMinsOffset;
    // convert hours
    let offsetFromLocalToUser = hrs_offset * 60 * 60 * 1000;
    // add minutes
    offsetFromLocalToUser += mins_offset * 60 * 1000;
    return offsetFromLocalToUser;
}

/*
Agile apps API provide the user settings time info in the local time of user instead of UTC time
The function returns the time by offsetting the local zone offset and append the user zone abbreviation
*/
getMappedTimeForAgileAppsAPI(date) {
    this.userRegion = localStorage.getItem("userRegion");
    this.dateFormat = localStorage.getItem("dateFormat");
    this.timeFormat = localStorage.getItem("timeFormat");

    if (date && this.dateFormat && this.timeFormat) {
        const format = this.dateFormat.toUpperCase() + " " + this.timeFormat;
        let returnObj = moment(date).tz(this.userRegion).format("z");
        if (returnObj.indexOf("+") > -1 || returnObj.indexOf("-") > -1) {
            returnObj = this.getUserLocaleDateTime(date).format(format) + " GMT " + moment().tz(this.userRegion).format("Z");
        } else {
            returnObj = this.getUserLocaleDateTime(date).format(format) + " " + moment().tz(this.userRegion).format(" z");
        }
        return returnObj;
    }
}

/*
Agile Apps APIs provide localised time (GMT + user_locale_offset). "moment(date)" adds the user_locale_offset again.
So, this function removed the user_locale_offset
*/
getUserLocaleDateTime(date) {
    const userAndLocalOffsetObj = this.getUserTimeOffsets(date);
    // move the time to GMT
    // if offset is +10 hrs, we need to reduce 10 to get GMT time
    let gmt_moment;
    if (userAndLocalOffsetObj && userAndLocalOffsetObj["local_aheadGMT"]) {
        gmt_moment = moment(date).subtract(userAndLocalOffsetObj["local_hrsOffset"], "hour").subtract(userAndLocalOffsetObj["local_minsOffset"], "minute");
    } else {
        gmt_moment = moment(date).add(userAndLocalOffsetObj["local_hrsOffset"], "hour").add(userAndLocalOffsetObj["local_minsOffset"], "minute");
    }
    return gmt_moment;
}
}


class OffsetObject {
    public userAheadGmt: boolean;
    public userHrsOffset: number;
    public userMinsOffset: number;
    public localHrsOffset: number;
    public localAheadGmt: boolean;
    public localMinsOffset: number;
}
