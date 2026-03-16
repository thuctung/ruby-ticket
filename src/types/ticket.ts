import { number } from "zod"

export interface LocationType {
    name: string,
    code: string,
}


export type TicketType = {
    id: string,
    ticket_type_code: string,
    catogory: string,
}

export type TicketByLocationType = {
    name: string,
    code: string,
}

export type ProductType = {
    id:string,
    ticket_type_code:string,
    price:number,
    stock:number,
    ticket_name:string,
    category:string,
    category_code:string,
    category_name:string,
}

export interface PersonType extends LocationType {}

export type ItemSelectType = {
    name:string,
    total:number,
    quantity: number,
    code:string,
    id:string,
}

export type ResultTicketSlectedType = {
    listItemSelect:ItemSelectType[],
    total:number
}