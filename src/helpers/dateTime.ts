import dayjs from "dayjs"


export const fullDateTimeFormat = (date:string) => {
    if(!date) return ''
    return dayjs(date).format("DD-MM-YYYY HH:mm:ss")
}