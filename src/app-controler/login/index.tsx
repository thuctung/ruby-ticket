"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACC_STATUS, ROLES } from "@/commons/constant";
import { ProfileStoteType, useProfileStore } from "@/stores/useProfileStore";
import ForgotPassword from "@/components/site/ForgotPassword";
import { sv_Login } from "./api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [openForgotPass, setOpenForgotpass] = useState(false)

  const { profile, errorMessage, isLogin }: ProfileStoteType = useProfileStore((state: any) => state);

  const handleAfterLogin = () => {
    if (profile.role === ROLES.ADMIN) {
      router.push('/admin');
    } else if (profile.status === ACC_STATUS.APPROVED) {
      router.push('/affiliate')
    }
  }

  useEffect(() => {
    if (profile.role) {
      handleAfterLogin()
    }
  }, [profile])

  const signIn = async () => {
    sv_Login({
      email,
      password,
    })
  };

  const closeDialog = (value:boolean) => {
    setOpenForgotpass(value)
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-md flex-1 p-6 content-center">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={(e) => {
              e.preventDefault();
              signIn()
            }}>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                />
              </div>
              <div className="space-y-2 mt-6">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

            {errorMessage ? <p className="text-sm text-destructive  mt-4">{errorMessage}</p> : null}

            <Button type="submit" className="w-full mt-6" disabled={isLogin} onClick={signIn}>
              {isLogin ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <Button
              className="w-full  mt-4"
              variant="outline"
              onClick={() => router.push("/register")}
            >
              Đăng ký làm Affiliate
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
             <Button
              className=""
              variant="link"
              onClick={() =>closeDialog(true)}
            >
              Quên mật khẩu
            </Button>
        </div>
        {openForgotPass && 
         <ForgotPassword openForgotPass={openForgotPass} setOpen={closeDialog}/>
        }
      </div>
      <Footer />
    </main>
  );
}
