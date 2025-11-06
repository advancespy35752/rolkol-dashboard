// app/(auth)/layout.tsx

import "../globals.css";

export const metadata = {
  title: "Rolkol Admin Login",
  description: "Sign in to access the admin dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-pageBg text-textMain antialiased">
        <div className="min-h-screen flex items-center justify-center p-6">
          {children}
        </div>
      </body>
    </html>
  );
}
