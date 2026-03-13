"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  listAffiliates,
  resetAffiliatePassword,
  seedAffiliateIfMissing,
  setAffiliateStatus,
  type AffiliateAccount,
} from "@/lib/adminStore";

export default function AdminAffiliatesPage() {
  const [all, setAll] = useState<AffiliateAccount[]>([]);
  const [seedEmail, setSeedEmail] = useState("affiliate@demo.local");
  const [seedName, setSeedName] = useState("Affiliate Demo");

  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [pwDialogEmail, setPwDialogEmail] = useState<string | null>(null);
  const [pwDialogPassword, setPwDialogPassword] = useState<string | null>(null);
  const [pwDialogUpdatedAt, setPwDialogUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const load = () => setAll(listAffiliates());
    load();

    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const counts = useMemo(() => {
    const pending = all.filter((a) => a.status === "pending").length;
    const approved = all.filter((a) => a.status === "approved").length;
    const suspended = all.filter((a) => a.status === "suspended").length;
    return { pending, approved, suspended, total: all.length };
  }, [all]);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Quản lý Affiliate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div className="rounded-xl border bg-muted/20 p-3">
            <div className="text-muted-foreground">Pending</div>
            <div className="text-lg font-semibold">{counts.pending}</div>
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <div className="text-muted-foreground">Approved</div>
            <div className="text-lg font-semibold">{counts.approved}</div>
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <div className="text-muted-foreground">Suspended</div>
            <div className="text-lg font-semibold">{counts.suspended}</div>
          </div>
          <div className="rounded-xl border bg-muted/20 p-3">
            <div className="text-muted-foreground">Total</div>
            <div className="text-lg font-semibold">{counts.total}</div>
          </div>
        </div>

        <div className="rounded-2xl border p-4 space-y-3">
          <div className="font-medium">Seed affiliate (demo)</div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={seedEmail} onChange={(e) => setSeedEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tên</Label>
              <Input value={seedName} onChange={(e) => setSeedName(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={() => seedAffiliateIfMissing(seedEmail, seedName)}
              >
                Thêm vào danh sách (pending)
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Hiện đang mock bằng localStorage. Khi nối Supabase, danh sách này lấy từ bảng affiliate_applications/profiles.
          </div>
        </div>

        <Separator />

        <div className="overflow-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="p-3">Tên</th>
                <th className="p-3">Email</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày đăng ký</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {all.length === 0 ? (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={5}>
                    Chưa có affiliate
                  </td>
                </tr>
              ) : (
                all.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3 font-medium">{a.name}</td>
                    <td className="p-3">{a.email}</td>
                    <td className="p-3">
                      <span className="rounded-full border px-2 py-1 text-xs">
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3">{a.createdAt.slice(0, 10)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {a.status === "pending" ? (
                          <Button
                            size="sm"
                            onClick={() => setAffiliateStatus(a.id, "approved")}
                          >
                            Chấp nhận
                          </Button>
                        ) : null}
                        {a.status === "approved" ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setAffiliateStatus(a.id, "suspended")}
                          >
                            Dừng làm aff
                          </Button>
                        ) : null}
                        {a.status === "suspended" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAffiliateStatus(a.id, "approved")}
                          >
                            Mở lại
                          </Button>
                        ) : null}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const res = resetAffiliatePassword(a.id);
                            if (!res) return;
                            setPwDialogEmail(a.email);
                            setPwDialogPassword(res.tempPassword);
                            setPwDialogUpdatedAt(res.passwordUpdatedAt);
                            setPwDialogOpen(true);
                          }}
                        >
                          Reset password
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={pwDialogOpen} onOpenChange={setPwDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset password (mock)</DialogTitle>
              <DialogDescription>
                Mật khẩu tạm thời cho affiliate. Sau khi nối Supabase Auth, bước này sẽ
                gửi email reset/OTP thật.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Affiliate: </span>
                <span className="font-medium">{pwDialogEmail ?? ""}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Temp password: </span>
                <span className="font-mono font-semibold">{pwDialogPassword ?? ""}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Updated: {pwDialogUpdatedAt?.slice(0, 19) ?? ""}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={async () => {
                  if (!pwDialogPassword) return;
                  await navigator.clipboard.writeText(pwDialogPassword);
                  alert("Copied temp password");
                }}
              >
                Copy
              </Button>
              <Button onClick={() => setPwDialogOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
