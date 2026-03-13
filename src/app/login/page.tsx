"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ACC_STATUS, ROLES } from "@/commons/constant";
import { sv_Login } from "@/services/auth";
import { ProfileStoteType, useProfileStore } from "@/stores/useProfileStore";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {profile, errorMessage, isLogin}:ProfileStoteType = useProfileStore((state:any ) => state);

  const handleAfterLogin = () => {
    if (profile.role === ROLES.ADMIN) {
      router.push('/admin');
    } else if (profile.status === ACC_STATUS.APPROVED) {
      router.push('/affiliate')
    }
  }

  useEffect(() => {
    if(profile.role){
      handleAfterLogin()
    }
  },[profile])

  const signIn = async () => {
    sv_Login({
      email,
      password,
    })
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-md flex-1 p-6 content-center">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

            <Button className="w-full" disabled={isLogin} onClick={signIn}>
              {isLogin ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push("/register")}
            >
              Đăng ký làm Affiliate
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
