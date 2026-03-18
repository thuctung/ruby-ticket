import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

export const dayjsEx = dayjs

export const VN_TIMEZONE = "Asia/Ho_Chi_Minh"

export const FULL_DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';

export const BASIC_DATE_FORMAT = 'DD-MM-YYYY';

export const SERVER_DATE_FORMAT = 'YYYY-MM-DD';

export const fullDateTimeFormat = (date: string) => {
    if (!date) return ''
    return dayjs.utc(date).tz(VN_TIMEZONE).format(FULL_DATE_FORMAT)
}

export const formatVNTime = (date: string | Date, format = FULL_DATE_FORMAT) => {
    if (!date) return ''
    return dayjs.utc(date).tz(VN_TIMEZONE).format(format)
}