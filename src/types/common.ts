export type CommonType = {
    loadingGlobal: boolean,
    messageToast: string,
    confirm: ConfirmType

    setGlobalLoading: (value: boolean) => void,

    setToastMessage: (value: string) => void,

    showConfirm: (value: ConfirmType) => void,
}

export type ConfirmType = {
    message: string | null,
    okFunc: Function | null
}

export type MenuMgtType = {
    link: string,
    lable: string
}

export type StatusType = {
    title:string,
    value:string
}