"use client";

import { useRouter } from "next/navigation";
import {  useState } from "react";

import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function UpdatePassword() {
  const router = useRouter();

  const [confirmPass, setConfirmPass] = useState("");
  const [password, setPassword] = useState("");
 const [errorMsg, setErrorMsg] = useState("");
 const [loading, setLoading] = useState(false);
    const supabaseClient= createSupabaseBrowserClient()


  const handleSubmit = async () => {
     if (password !== confirmPass) {
      setErrorMsg("Passwords do not match");
      return;
    }
      setLoading(true);

    const { error } = await supabaseClient.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Password updated successfully");
      window.location.href = "/login";
    }
  };


  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-md flex-1 p-6 content-center">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Cập nhật mật khẩu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit()
            }}>

              <div className="space-y-2">
                <Label htmlFor="email">Mật khẩu mới</Label>
                <Input
                  type="password"
                  id="email"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 mt-6">
                <Label htmlFor="password">Nhập lại mật khẩu</Label>
                <Input
                  id="confirmPass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

            {errorMsg ? <p className="text-sm text-destructive  mt-4">{errorMsg}</p> : null}

            <Button type="submit" className="w-full mt-6" disabled={loading} onClick={handleSubmit}>
              {loading ? "Cập nhật..." : "Submit"}
            </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mx-auto w-full max-w-md flex-1  content-center flex justify-between">
           <Button
              className=""
              variant="link"
              onClick={() => router.push("/")}
            >
              Trang chủ
            </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
