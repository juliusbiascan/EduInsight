import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { StaffClient } from "./components/client";
import { UserColumn } from "./components/columns";
import { UserRole } from "@prisma/client";

const Staff = async ({
  params
}: {
  params: { labId: string }
}) => {

  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const lab = await db.labaratory.findFirst({
    where: {
      id: params.labId,
      userId: session.user.id,
    }
  });


  if (!lab) {
    redirect('/');
  };

  const user = await db.user.findMany({
    where: {
      labId: params.labId,
      role: UserRole.USER,
    },
  })

  const formatedUsers: UserColumn[] = user.map(item => ({
    id: item.id,
    name: item.name,
    email: item.email,
    password: item.password,
    isTwoFactorEnabled: item.isTwoFactorEnabled,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <StaffClient data={formatedUsers} />
      </div>
    </div>
  );

}

export default Staff;