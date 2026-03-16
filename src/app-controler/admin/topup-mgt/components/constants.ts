import { TOPUPS_STATUS } from "@/commons/constant";
import { StatusType } from "@/types";

export const getStatusTopupName = (status: string) => {
   switch (status) {
      case TOPUPS_STATUS.APPROVED:
         return 'Thành công'
      case TOPUPS_STATUS.PENDING:
         return 'Đợi duyệt';
      case TOPUPS_STATUS.REJECTED:
         return 'Từ chối'
      default:
         return ''
   }
}


export const listTopupMgtStatus: StatusType[] = [
   { title: getStatusTopupName(TOPUPS_STATUS.APPROVED), value: TOPUPS_STATUS.APPROVED },
   { title: getStatusTopupName(TOPUPS_STATUS.PENDING), value: TOPUPS_STATUS.PENDING },
   { title: getStatusTopupName(TOPUPS_STATUS.REJECTED), value: TOPUPS_STATUS.REJECTED },
]