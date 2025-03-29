import Sidebar from "@/components/Sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
      >
        
          <div className="flex h-screen">
            {/* <Sidebar /> */}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
      </body>
    </html>
  );
}