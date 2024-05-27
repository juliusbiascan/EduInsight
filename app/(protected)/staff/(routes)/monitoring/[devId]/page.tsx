import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { VncClient } from "./components/vnc-client";
import { getDeviceById } from "@/data/device";

const Monitoring = async ({
  params
}: {
  params: { devId: string }
}) => {

  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const device = await getDeviceById(params.devId)

  if (!device) {
    return (
      <div className="w-full flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
          No Device Found!
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <VncClient device={device} />
      </div>
    </div>
  );
}

export default Monitoring;