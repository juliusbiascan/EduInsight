import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MonitoringClient } from "./components/client";

const Monitoring = async () => {

  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (!user) {
    return null;
  }

  const labId = user.labId

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <MonitoringClient labId={labId} />
      </div>
    </div>
  );
}

export default Monitoring;