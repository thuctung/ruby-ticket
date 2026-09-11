import { ConfirmProvider } from "@/components/site/Confirm";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { LangKey } from "@/types";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Header locale={locale as LangKey} />
      {children}
      <Footer locale={locale as LangKey} />
      <ConfirmProvider />
    </main>
  );
}
