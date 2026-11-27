import FloatingContact from "@/components/site/FloatingContact";
import { LoadingGlobal } from "@/components/ui/loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <LoadingGlobal />
    </>
  );
}
