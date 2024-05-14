import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDeviceUserById } from "@/data/user";
import { ResultClient } from "./components/result-client";

const DevUserRegistrationPage = async ({ params }: { params: { result: string } }) => {

  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  console.log(params.result);

  const user = await getDeviceUserById(params.result)

  if (!user) {
    redirect("/in-out/")
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ResultClient
          user={user}
        />
      </div>
    </div>
  )
}

export default DevUserRegistrationPage;