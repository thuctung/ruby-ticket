import { ACC_STATUS } from "@/commons/constant";

 export const getStatusName = (status:string) => {
        switch(status){
            case ACC_STATUS.APPROVED:
               return 'Đang hoạt động'
            case ACC_STATUS.PENDING:
               return 'Đợi duyệt';
            case ACC_STATUS.SUSPENDED:
                return 'Tạm dừng'
        }
    }