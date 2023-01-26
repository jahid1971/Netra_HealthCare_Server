/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../errors/AppError";
import { User, UserStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    errorFormat: "minimal",
});

export const findUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { email, status: "ACTIVE" },
    });
};

export const findUserById = async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { id, status: "ACTIVE" },
    });

    if (!user) throw new AppError(404, "User not found");

    return user;
};


export const findById = async (
    Model: any,
    id: string,
    modelName = "Record"
) => {
    const result = await Model.findUnique({
        where: { id, isDeleted: false },
    });

    if (!result) throw new AppError(404, `${modelName}  not found`);

    return result;
};

export const deleteById = async (
    modelName: string,
    id: string,
    referenceField: string = "email"
) => {
    return await prisma.$transaction(async (prismaClient: any) => {
        await findById(prismaClient[modelName], id, modelName);

        const deletedRecord = await prismaClient[modelName].delete({
            where: { id },
        });

        await prismaClient.user.delete({
            where: { [referenceField]: deletedRecord[referenceField] },
        });

        return deletedRecord;
    });
};

export const softDeleteById = async (
    modelName: string,
    id: string,
    referenceField: string = "email"
) => {
    return await prisma.$transaction(async (prismaClient: any) => {
        await findById(prismaClient[modelName], id, modelName);

        const softDeletedRecord = await prismaClient[modelName].update({
            where: { id },
            data: { isDeleted: true },
        });

        await prismaClient.user.update({
            where: { [referenceField]: softDeletedRecord[referenceField] },
            data: { status: UserStatus.DELETED },
        });

        return softDeletedRecord;
    });
};