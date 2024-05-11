import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth()

  if (!session) {
    redirect("/welcome")
  }

  const lab = await db.labaratory.findFirst({
    where: {
      userId: session.user.id
    }
  })

  const user = await db.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (lab && session.user.role == UserRole.ADMIN) {
    redirect(`/admin/${lab.id}`)
  } else if (user && session.user.role == UserRole.USER) {
    redirect(`staff/${user.labId}`)
  }

  return (
    <>
      {children}
    </>
  )
}
