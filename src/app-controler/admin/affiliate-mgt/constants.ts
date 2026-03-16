import { ACC_STATUS } from "@/commons/constant";
import { StatusType } from "@/types";

 export const getStatusName = (status:string) => {
        switch(status){
            case ACC_STATUS.APPROVED:
               return 'Đang hoạt động'
            case ACC_STATUS.PENDING:
               return 'Đợi duyệt';
            case ACC_STATUS.SUSPENDED:
                return 'Tạm dừng'
            default: 
            return ''
        }
    }

  export  const listAccStatus :StatusType[] = [
    {title:getStatusName(ACC_STATUS.APPROVED) , value:ACC_STATUS.APPROVED},
    {title:getStatusName(ACC_STATUS.PENDING) , value:ACC_STATUS.PENDING},
    {title:getStatusName(ACC_STATUS.SUSPENDED) , value:ACC_STATUS.SUSPENDED},
  ]