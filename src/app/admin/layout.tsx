"use client";

import Link from "next/link";

import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <div className="mx-auto max-w-6xl flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <aside className="md:w-64">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">Admin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/affiliates">Quản lý Affiliate</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/pricing">Quản lý giá vé</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/inventory">Nhập số lượng vé</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/stats">Thống kê</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          <section className="flex-1">{children}</section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
