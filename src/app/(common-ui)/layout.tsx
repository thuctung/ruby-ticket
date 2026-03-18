import { ConfirmProvider } from "@/components/site/Confirm";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import FloatingContact from "@/components/site/FloatingContact";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <main className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />
                {children}
            <Footer />
            <ConfirmProvider/>
            <FloatingContact/>
        </main>
    );
}
