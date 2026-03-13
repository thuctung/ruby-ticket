"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/money";
import { getWallet, topup } from "@/lib/affiliateStore";

export default function AffiliateTopupPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState<number>(500000);

  useEffect(() => {
    const load = () => setBalance(getWallet().balance);
    load();

    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const canTopup = useMemo(() => amount > 0 && amount <= 100_000_000, [amount]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Nạp tiền vào ví (mock)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Số dư hiện tại</div>
            <div className="text-lg font-semibold">{formatVND(balance)}</div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền nạp</Label>
            <Input
              id="amount"
              type="number"
              inputMode="numeric"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Sau này sẽ nối VNPAY topup thật. Hiện tại chỉ cộng số dư bằng localStorage.
            </p>
          </div>

          <Button
            disabled={!canTopup}
            onClick={() => {
              topup(amount);
            }}
          >
            Nạp {formatVND(amount)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
