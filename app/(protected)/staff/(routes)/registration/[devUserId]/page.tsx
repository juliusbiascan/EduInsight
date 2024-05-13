import { db } from "@/lib/db";
import { DeviceUserForm } from "./components/registration-form";
import { getUserById } from "@/data/user";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const DevUserRegistrationPage = async ({ params }: { params: { devUserId: string } }) => {

  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const devUser = await db.deviceUser.findUnique({
    where: {
      id: params.devUserId
    },
  });

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/login")
  }

  const lab = await db.labaratory.findUnique({
    where: {
      id: user.labId!,
    }
  })

  if (!lab) {
    redirect("/")
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <DeviceUserForm
          initialData={devUser}
          labId={lab.id} />
      </div>
    </div>
  )
}

export default DevUserRegistrationPage;