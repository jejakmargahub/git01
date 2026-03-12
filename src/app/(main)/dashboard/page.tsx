import { getUserFamilies } from "@/lib/actions/family";
import { auth } from "@/lib/auth";
import { IS_DEMO_MODE } from "@/lib/demo-mode";
import { getDemoFamilies, DEMO_USER } from "@/lib/db/mock-data";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  if (IS_DEMO_MODE) {
    const families = getDemoFamilies().map((f) => ({
      family: f,
      role: f.role,
      memberCount: f.memberCount,
    }));
    return (
      <DashboardClient
        userName={DEMO_USER.name}
        families={families}
      />
    );
  }

  const session = await auth();
  const families = await getUserFamilies();

  return (
    <DashboardClient
      userName={session?.user?.name || "Pengguna"}
      families={families}
    />
  );
}
