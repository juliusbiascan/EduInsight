import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const Monitoring = async ({
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
  return (
    <>
      Monitoring
    </>
  );
}

export default Monitoring;