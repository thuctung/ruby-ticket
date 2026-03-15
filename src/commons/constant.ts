import { MenuMgtType } from "@/types"

export const ACC_STATUS = {
   PENDING:'pending',
   APPROVED:'approved',
   SUSPENDED:'suspended',
}


export const ROLES = {
    CUSTOMER :'customer',
    AFFILIATE :'affiliate',
    ADMIN :'admin',
}

export const LIMIT_TABLE = 20


export const SIDEBAR_ADMIN: MenuMgtType[] = [
    {link:'/admin/affiliates', lable:'Affiliate'},
    {link:'/admin/pricing', lable:'Quản lý giá vé'},
    {link:'/admin/inventory', lable:'Nhập vé'},
    {link:'/admin/stats', lable:'Thống kê'},
]


export const SIDEBAR_AFF: MenuMgtType[] = [
    {link:'/affiliate/topup', lable:'Nạp tiền'},
    {link:'/affiliate/issue', lable:'Rút vé'},
    {link:'/affiliate/stats', lable:'Thống kê'},
]