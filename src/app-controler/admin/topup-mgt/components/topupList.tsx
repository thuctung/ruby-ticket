
'use-client'


import { TOPUPS_STATUS } from "@/commons/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { fullDateTimeFormat } from "@/helpers/dateTime";
import { formatVND } from "@/lib/money";
import { getStatusTopupName } from "./constants";
import { TopupMgtResponseType } from "@/types";
import { Button } from "@/components/ui/button";

type TopupHistoryProps = {
    history: TopupMgtResponseType[],
    onApproveTopup: (id: TopupMgtResponseType) => void
}

export function TopupMgtList({ history, onApproveTopup }: TopupHistoryProps) {

    const statusClass: Record<string, string> = {
        [TOPUPS_STATUS.PENDING]: "text-yellow-600 bg-yellow-100",
        [TOPUPS_STATUS.APPROVED]: "text-green-600 bg-green-100",
        [TOPUPS_STATUS.REJECTED]: "text-red-600 bg-red-100",
    }

    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Lịch sử nạp tiền</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto rounded-2xl border">
                    <table className="w-full text-sm">
                        <thead className="text-left text-muted-foreground">
                            <tr>
                                <th className="p-3">Ngày nạp</th>
                                <th className="p-3">Username</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Số tiền</th>
                                <th className="p-3">Mã nạp</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history?.length === 0 ? (
                                <tr>
                                    <td className="p-3 text-muted-foreground" colSpan={5}>
                                        Không tìm thây lịch sử
                                    </td>
                                </tr>
                            ) : (
                                history.map((item: TopupMgtResponseType, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-3 font-medium">{fullDateTimeFormat(item.created_at)}</td>
                                        <td className="p-3">{item.username}</td>
                                        <td className="p-3">{item.email}</td>
                                        <td className="p-3">{formatVND(item.amount)}</td>
                                        <td className="p-3">{item.payment_code}</td>

                                        <td className="p-3">

                                            <span className={`rounded-full border px-2 py-1 text-xs  ${statusClass[item.status]}`}>
                                                {getStatusTopupName(item.status)}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => onApproveTopup(item)}
                                                    disabled={item.status !== TOPUPS_STATUS.PENDING}
                                                >
                                                    {TOPUPS_STATUS.PENDING ? 'Chấp nhận' : 'Đã duyệt'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>)
}