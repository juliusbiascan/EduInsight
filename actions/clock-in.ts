"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { ClockInSchema } from "@/schemas";
import { State } from "@prisma/client";

export const clockIn = async (values: z.infer<typeof ClockInSchema>) => {

  const validatedFields = ClockInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: `Invalid fields!` };
  }

  const { deviceId, userId } = validatedFields.data;


  const activeDeviceUser = await db.activeDeviceUser.count({
    where: {
      userId,
    }
  });

  if (activeDeviceUser == 1) {

    await db.activeDeviceUser.deleteMany({
      where: {
        userId,
      }
    });

    return { success: "User logout successfully" };
  }

  const device = await db.device.findUnique({
    where: {
      id: deviceId,
    }
  })


  if (!device) {
    return { error: "Device already in used!" };
  }

  await db.activeDeviceUser.create({
    data: {
      labId: device.labId,
      deviceId,
      userId,
      state: State.ACTIVE
    },
  });

  return { success: "User login successfully" };
};
