import { db } from "@/lib/db";
import { families, familyAccess } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import { getMessages } from "@/lib/actions/chat";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export const dynamic = 'force-dynamic';

export default async function FamilyChatPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const familyId = params.id;

  // Verify access and get family details
  const family = await db.query.families.findFirst({
    where: eq(families.id, familyId),
    with: {
      access: {
        where: eq(familyAccess.userId, session.user.id),
      },
    },
  });

  if (!family || family.access.length === 0) {
    redirect("/dashboard");
  }

  const initialMessages = await getMessages(familyId);

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] md:h-[calc(100vh-64px)] bg-background">
      {/* Header */}
      <header className="px-4 py-3 bg-card border-b border-border flex items-center gap-3 sticky top-0 z-10">
        <Link 
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-sm font-semibold truncate leading-tight">
            Chat: {family.name}
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Ruang Diskusi Keluarga
          </p>
        </div>
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow 
          familyId={familyId} 
          initialMessages={initialMessages} 
          currentUser={session.user} 
        />
      </div>
    </div>
  );
}
