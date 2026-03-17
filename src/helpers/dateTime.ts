import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

 export const dayjsEx = dayjs


export const FULL_DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';

export const BASIC_DATE_FORMAT = 'DD-MM-YYYY';

export const SERVER_DATE_FORMAT = 'YYYY-MM-DD';

export const fullDateTimeFormat = (date:string) => {
    if(!date) return ''
    return dayjsEx(date).format(FULL_DATE_FORMAT)
}