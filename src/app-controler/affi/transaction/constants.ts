import { TYPE_TRANSACTION } from "@/commons/constant";
import { StatusType } from "@/types";

 export const getTypeName = (status:string) => {
        switch(status){
            case TYPE_TRANSACTION.ADD:
               return 'Nạp tiền'
            case TYPE_TRANSACTION.TICKET_BUY:
               return 'Rút vé'
            default:
            return ''
        }
    }

  export  const TYPE_LIST :StatusType[] = [
    {title:getTypeName(TYPE_TRANSACTION.ADD) , value:TYPE_TRANSACTION.ADD},
    {title:getTypeName(TYPE_TRANSACTION.TICKET_BUY) , value:TYPE_TRANSACTION.TICKET_BUY},
  ]