"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { QRBankResponseType } from "@/types";
import { BANK_INFO } from "@/commons/constant";
import { formatVND } from "@/helpers/money";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CODE_BANK } from "@/commons/code-bank";
import Countdown from "./countdown";

type BankTransferQRProps = {
  dataQR: QRBankResponseType;
  onDone?: () => void;
  onCancle?: () => void;
  isOpen: boolean;
  mesage?: string;
};

export default function BankTransferQR({
  dataQR,
  isOpen,
  mesage,
  onDone,
  onCancle,
}: BankTransferQRProps) {
  const copy = (text?: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };
  const downloadQR = async () => {
    const response = await fetch(dataQR.qr);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${dataQR.code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };
  return (
    <Dialog open={isOpen}>
      <DialogTitle>BankTransferQR</DialogTitle>
      <DialogContent
        className="[&>button]:hidden"
        style={{ maxHeight: "95vh", overflowY: "auto", zIndex: 9999 }}
      >
        <div className="space-y-4">
          <img src={dataQR.qr} className="w-64 mx-auto" />
          <div className="flex justify-center gap-2">
            <Button onClick={downloadQR} variant="secondary">
              Tải mã QR
            </Button>
          </div>

          <div className="text-sm space-y-2">
            {BANK_INFO.bankName ? (
              <Row label="Ngân hàng" value={CODE_BANK[BANK_INFO.bankName]} />
            ) : null}

            <Row
              label="Số tài khoản"
              value={BANK_INFO.bankNum}
              onCopy={() => copy(BANK_INFO.bankNum)}
            />
            <Row label="Người nhận" value="CONG TY TNHH DVTM DU LICH RUBY" />
            <Row label="Số tiền" value={formatVND(dataQR.amount)} />
            <Row label="Nội dung CK" value={dataQR.code} onCopy={() => copy(dataQR.code)} />
          </div>
        </div>
        <span className="text-sm text-center text-red-500">{mesage}</span>
        <Countdown totalSecounds={10 * 60} />
        <div className="flex ">
          <div className="w-full flex justify-center ">
            {onDone && <Button onClick={onDone}>Đã chuyển khoản</Button>}
          </div>
          {onCancle && (
            <div className="w-full flex justify-center ">
              <Button variant="destructive" onClick={onCancle}>
                Hủy giao dịch
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, onCopy }: { label?: string; value?: string; onCopy?: () => void }) {
  return (
    <div className="flex items-center justify-between border rounded-md p-2">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>

      {onCopy && (
        <Button size="icon" variant="ghost" onClick={onCopy}>
          <Copy size={16} />
        </Button>
      )}
    </div>
  );
}
