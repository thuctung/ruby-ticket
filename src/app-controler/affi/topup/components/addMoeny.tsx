"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/helpers/money";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType } from "@/types";

type AddMoenyProps = {
    onSubmitTopup: (amount:number)=>void,
    curentBalance?: number,
}

export default function AddMoeny({curentBalance, onSubmitTopup}:AddMoenyProps) {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState<number>(1000000);

   const { showConfirm }: CommonType | any = useCommonStore.getState();


    const canTopup = useMemo(() => amount > 0 && amount <= 1000000000, [amount]);

    const handleTopup = () => {
        showConfirm({
            message:`Xác nhận nạp ${formatVND(amount)}`,
            okFunc: () => onSubmitTopup(amount)
        })
    }


    return <Card className="rounded-2xl">
        <CardHeader>
            <CardTitle>Nạp tiền vào ví </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Số dư hiện tại</div>
                <div className="text-lg font-semibold">{curentBalance ? formatVND(curentBalance):'0'}</div>
            </div>

            <Separator />

            <div className="space-y-2 ">
                <Label htmlFor="amount">Số tiền nạp</Label>
                <Input
                    id="amount"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>

            <Button
                disabled={!canTopup}
                onClick={() => {
                    handleTopup();
                }}
                className="float-right"
            >
                Nạp {formatVND(amount)}
            </Button>
        </CardContent>
    </Card>

}