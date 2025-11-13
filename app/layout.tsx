import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Rolkol Dashboard",
  description: "Voice AI Control Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-pageBg text-textMain antialiased">
        <div className="flex h-screen w-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Right side */}
          <main className="flex-1 flex flex-col bg-pageBg">
            {/* Top nav */}
            <header className="h-14 flex items-center justify-between px-6 bg-headerBg border-b border-borderSoft shadow-header">
              <div className="text-sm font-medium text-textMain">
                Rolkol Dashboard
              </div>
            </header>

            {/* Page body */}
            <section className="flex-1 overflow-hidden p-6">
              <div className="mx-auto h-full max-w-[1400px] space-y-6">
                {children}
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}