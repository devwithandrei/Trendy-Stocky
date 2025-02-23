import { PrismaClient } from "@prisma/client";

const prismadb = global.prismadb || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prismadb = prismadb;

export default prismadb;
