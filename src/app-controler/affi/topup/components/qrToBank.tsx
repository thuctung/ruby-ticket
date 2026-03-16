"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { QRBankResponseType } from "@/types"
import { BANK_INFO } from "@/commons/constant"
import { formatVND } from "@/helpers/money"

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"


type BankTransferQRProps = {
    dataQR: QRBankResponseType,
    onDone:() => void,
    isOpen:boolean,
}

export default function BankTransferQR({
    dataQR,
    isOpen,
    onDone
}: BankTransferQRProps) {
    const copy = (text?: string) => {
        if (text) {
            navigator.clipboard.writeText(text)
        }
    }
    return (
        <Dialog open={isOpen} >
            <DialogTitle></DialogTitle>
            <DialogContent>
                <div className="space-y-4">
                    <img src={dataQR.qr} className="w-64 mx-auto" />
                    <div className="text-sm space-y-2">
                        <Row
                            label="Ngân hàng"
                            value={BANK_INFO.bankName}
                            onCopy={() => copy(BANK_INFO.bankName)}
                        />
                        <Row
                            label="Số tài khoản"
                            value={BANK_INFO.bankNum}
                            onCopy={() => copy(BANK_INFO.bankNum)}
                        />
                        <Row
                            label="Số tiền"
                            value={formatVND(dataQR.amount)}
                        />
                        <Row
                            label="Nội dung CK"
                            value={dataQR.code}
                            onCopy={() => copy(dataQR.code)}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center mt-6"><Button onClick={onDone}>Xong</Button></div>
            </DialogContent>
        </Dialog>
    )
}

function Row({
    label,
    value,
    onCopy
}: {
    label?: string
    value?: string
    onCopy?: () => void
}) {
    return (
        <div className="flex items-center justify-between border rounded-md p-2">
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>

            {onCopy && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={onCopy}
                >
                    <Copy size={16} />
                </Button>
            )}
        </div>
    )
}