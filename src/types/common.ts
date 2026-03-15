export type CommonType = {
    loadingGlobal: boolean,
    isShowToast: boolean,
    messageToast: string,

    setGlobalLoading: (value: boolean) => void,

    setToastMessage: (value: string) => void,

}

export type MenuMgtType = {
    link:string,
    lable:string
}