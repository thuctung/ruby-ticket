import { MenuMgtType } from "@/types"
import { LocationType, PersonType, TicketType } from "@/types/ticket"

export const ACC_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    SUSPENDED: 'suspended',
}


export const TYPE_TRANSACTION = {
    ADD: 'add',
    PAID: 'PAID',
    TICKET_BUY:'ticket_buy'
}

export const ROLES = {
    CUSTOMER: 'customer',
    AFFILIATE: 'affiliate',
    ADMIN: 'admin',
}

export const TOPUPS_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
}

export const LIMIT_TABLE = 20


export const SIDEBAR_ADMIN: MenuMgtType[] = [
    { link: '/admin/affiliates', lable: 'Affiliate' },
    { link: '/admin/pricing', lable: 'Quản lý giá vé' },
    { link: '/admin/topup-mgt', lable: 'Quản lý nạp tiền' },
    { link: '/admin/inventory', lable: 'Nhập vé' },
    { link: '/admin/stats', lable: 'Thống kê' },
]


export const SIDEBAR_AFF: MenuMgtType[] = [
    { link: '/affiliate/topup', lable: 'Nạp tiền' },
    { link: '/affiliate/get-ticket', lable: 'Rút vé' },
    { link: '/affiliate/stats', lable: 'Thống kê' },
    { link: '/affiliate/transaction', lable: 'Lịch sử giao dịch' },
]

export const DB_TABLE_NAME = {
    TOPUPS: 'topups',
    PROFILES: 'profiles',
    VIEW_PROFILE_TOPUP:'topups_with_profiles',
    FUC_UPADTE_STAUS_BALANCE:'approve_topup',
    AFF_APPLICATION:'affiliate_applications',
    TICKET_TYPES:'ticket_types',
    TICKET_TICKET_VARIANT:'ticket_variants',
    VIEW_TICET_VARIANTS_AND_CATEGORY:'ticket_variants_and_category',
    FUNC_BY_TICKET :'buy_tickets',
    LOCATIONS :'locations',
    WALLET_TRANSACTION:'wallet_transactions'
}


export const BANK_INFO = {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME,
    bankNum: process.env.NEXT_PUBLIC_BANK_NUM,
    bankAccName: process.env.NEXT_PUBLIC_BANK_ACC_NAME
}


export const LOCATIONS: LocationType[] = [
    {
        name:'Bà Nà Hill',
        code:'BANA'
    }, {
        name:'Núi Thần Tài',
        code:'NUITHANTAI'
    }
    , {
        name:'Vinperl Nam Hội An',
        code:'VINPER'
    }, {
        name:'Kí ức Hội An',
        code:'KWHOIAN'
    }, {
        name:'Du Thuyền Sông Hàn',
        code:'DUTHUYEN'
    }, 
]


export const PERSONS:PersonType[] = [
    {code:'LON', name:'Người lớn'},
    {code:'NHO', name:'Trẻ em/ Người già'},
]