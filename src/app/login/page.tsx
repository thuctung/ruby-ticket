"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const {data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }

     if (data.user) {
      const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("status")  // lấy thêm các field cần
      .eq("user_id", data.user.id)
      .single();  // .single() vì mỗi user chỉ có 1 profile
      console.log('profile',profile)
      if(profile){
         return
      router.push("/");
      router.refresh();
      } 
          setError(profileError.message);
     }
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <div className="mx-auto w-full max-w-md flex-1 p-6">
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

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button className="w-full" disabled={loading} onClick={signIn}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
