import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import FloatingContact from "@/components/ui/float-contact";


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
            <FloatingContact/>
        </main>
    );
}
