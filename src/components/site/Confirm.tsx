"use client"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { useCommonStore } from "@/stores/useCommonStore"
import { CommonType, ConfirmType } from "@/types"
import { isEmpty } from "lodash"


export function ConfirmProvider() {

    const { confirm }: CommonType = useCommonStore((state: any) => state);
    const { showConfirm }: CommonType | any = useCommonStore.getState();

    const initConfirm: ConfirmType = {
        message: null,
        okFunc: null
    }

    const handleCancel = () => {
        showConfirm(initConfirm)

    }

    const handleOk = () => {
        if (confirm.okFunc) {
            confirm.okFunc();
            const initConfirm: ConfirmType = {
                message: null,
                okFunc: null
            }
            showConfirm(initConfirm)
        }
    }

    return (
        <AlertDialog open={!isEmpty(confirm.message)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận</AlertDialogTitle>
                    <AlertDialogDescription>
                        {confirm.message}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
                        Huỷ
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleOk}>
                        OK
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
