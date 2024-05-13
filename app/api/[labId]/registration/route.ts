import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { DeviceUserRole } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { labId: string } }
) {
  try {

    const session = await auth();

    const body = await req.json();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { id } = session.user;

    const {
      name,
      image,
      role
    } = body;

    if (!id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!image) new NextResponse("Image is required", { status: 400 });

    if (!role) new NextResponse("Role is required", { status: 400 });


    if (!params.labId) {
      return new NextResponse("Lab Id is required", { status: 400 });
    }

    const device = await db.deviceUser.create({
      data: {
        labId: params.labId,
        name,
        image,
        role: role == "GUEST" ? DeviceUserRole.GUEST : role == "STUDENT" ? DeviceUserRole.STUDENT : DeviceUserRole.TEACHER,
      }
    })

    return NextResponse.json(device);

  } catch (err) {
    console.log(`[DEVICE_USER_POST] ${err}`);
    return new NextResponse(`Internal error`, { status: 500 })
  }
}