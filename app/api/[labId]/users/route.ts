import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";

import bcrypt from "bcryptjs";

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
      email,
      password,
      isTwoFactorEnabled
    } = body;

    if (!id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }
    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    if (!params.labId) {
      return new NextResponse("Lab Id is required", { status: 400 });
    }

    const labByUserId = await db.labaratory.findFirst({
      where: {
        id: params.labId,
        userId: id,
      }
    })

    if (!labByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const device = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isTwoFactorEnabled,
        labId: params.labId,
        emailVerified: new Date(),
      }
    })

    return NextResponse.json(device);

  } catch (err) {
    console.log(`[DEVICE_POST] ${err}`);
    return new NextResponse(`Internal error`, { status: 500 })
  }
}
