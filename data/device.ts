"use server"

import { db } from "@/lib/db";
import { State } from "@prisma/client";

export const getAllDevice = async (labId: string) => {
  try {
    const device = await db.device.findMany({ where: { labId } });
    return device;
  } catch {
    return null;
  }
};

export const getTotalDevices = async (labId: string) => {
  try {
    const device = await db.device.count({ where: { labId } });
    return device;
  } catch {
    return null;
  }
};

export const getDeviceById = async (devId: string) => {
  try {
    const device = await db.device.findUnique({ where: { id: devId } });
    return device;
  } catch {
    return null;
  }
};

export const getAllActiveUserDevice = async (labId: string) => {
  try {
    const device = await db.activeDeviceUser.findMany({ where: { labId, state: State.ACTIVE } });
    return device;
  } catch {
    return null;
  }
};
export const getAllInactiveUserDevice = async (labId: string) => {
  try {
    const device = await db.activeDeviceUser.findMany({ where: { labId, state: State.INACTIVE } });
    return device;
  } catch {
    return null;
  }
};
