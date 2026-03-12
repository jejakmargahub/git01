export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background:
          "linear-gradient(135deg, var(--primary) 0%, #7c3aed 50%, #ec4899 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          animation: "slideUp 0.5s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
