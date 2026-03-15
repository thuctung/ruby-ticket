import { ProfileType } from "./profile"

export type AdminAffiResponseType = {
    currentPage:number,
    profiles: ProfileType[],
    total:number,
    totalPages:number
}