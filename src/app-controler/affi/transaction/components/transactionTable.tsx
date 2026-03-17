
'use-client'


import { TractionResponseType } from "@/types";
import {  TYPE_TRANSACTION } from "@/commons/constant";
import { getTypeName } from "../constants";
import { formatVND } from "@/helpers/money";
import dayjs from "dayjs";

type TractionTableProps = {
    transactions: TractionResponseType[],
}

export function TractionTable({ transactions, }: TractionTableProps) {

    const statusClass: Record<string, string> = {
        [TYPE_TRANSACTION.ADD]: "text-green-600 bg-green-100",
        [TYPE_TRANSACTION.TICKET_BUY]: "text-red-600 bg-red-100",
    }


    return (
    <div className="overflow-auto rounded-2xl border">
        <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
                <tr>
                    <th className="p-3">Stt</th>
                    <th className="p-3">Loại giao dịch</th>
                    <th className="p-3">Số tiền</th>
                    <th className="p-3">Ngày giao dịch</th>
                    <th className="p-3">Mô tả</th>
                </tr>
            </thead>
            <tbody>
                {transactions.length === 0 ? (
                    <tr>
                        <td className="p-3 text-muted-foreground" colSpan={5}>
                            Chưa có affiliate
                        </td>
                    </tr>
                ) : (
                    transactions.map((transactions: TractionResponseType, index: number) => (
                        <tr key={index} className="border-t">
                            <td className="p-3 font-medium">{index + 1}</td>
                            <td className="p-3"><span className={`rounded-full border px-2 py-1 text-xs  ${statusClass[transactions.type]}`}>
                                {getTypeName(transactions.type)}
                            </span></td>
                            <td className="p-3">{formatVND(transactions.amount)}</td>
                            <td className="p-3">{dayjs(transactions.created_at).format('DD/MM/YYYY hh:mm:ss')}</td>
                            <td className="p-3">{transactions.description}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>)
}