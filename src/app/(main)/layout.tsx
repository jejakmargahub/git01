import Providers from "@/components/Providers";
import BottomNav from "@/components/ui/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="page-container">
        {children}
        <BottomNav />
      </div>
    </Providers>
  );
}
