import { db } from "../prisma/prismaClient";
import { createUser } from "../../models/userModel";

async function establishDatabaseConnection() {
    try {
        await db.$connect();
        console.log("Connected to the database.");
    } catch (e) {
        console.error("Failed to connect to the database:", e);
        throw e;
    }
}

async function clearPostTagTable() {
    try {
        await db.$queryRaw`Truncate PostTag;`
        console.log("Cleared post tag table.");
    } catch (e) {
        console.error("Failed to clear post tag table:", e);
        throw e;
    }
}

async function clearPostImageTable() {
    try {
        await db.$queryRaw`Truncate PostImage;`
        console.log("Cleared post tag table.");
    } catch (e) {
        console.error("Failed to clear post tag table:", e);
        throw e;
    }
}

async function clearPostTable() {
    try {
        await db.$queryRaw`Truncate Post;`
        console.log("Cleared post table.");
    } catch (e) {
        console.error("Failed to clear post table:", e);
        throw e;
    }
}

async function clearUserTable() {
    try {
        await db.$queryRaw`Truncate User;`
        console.log("Cleared user table.");
    } catch (e) {
        console.error("Failed to clear user table:", e);
        throw e;
    }
}

async function clearCommentTable() {
    try {
        await db.$queryRaw`Truncate Comment;`
        console.log("Cleared comment table.");
    } catch (e) {
        console.error("Failed to clear comment table:", e);
        throw e;
    }
}

async function clearTagTable() {
    try {
        await db.$queryRaw`Truncate Tag;`
        console.log("Cleared tag table.");
    } catch (e) {
        console.error("Failed to clear tag table:", e);
        throw e;
    }
}

async function clearUserFollowerTable() {
    try {
        await db.$queryRaw`Truncate UserFollower;`
        console.log("Cleared UserFollower table.");
    } catch (e) {
        console.error("Failed to clear UserFollower table:", e);
        throw e;
    }
}

export async function setupDatabaseForOperations() {
    await establishDatabaseConnection();

    // await clearPostImageTable();
    // await clearPostTagTable();
    // await clearTagTable();
    // await clearCommentTable();
    // await clearPostTable();
    // await clearUserFollowerTable();
    await clearUserTable();

}

async function main() {
    await setupDatabaseForOperations();
    await createUser({ name: "aaa", email: "aaa@aaa.aaa", password: "aaa", isAdmin: false });
}

main()
    .catch((e) => console.error(e))
    .finally(() => {
        console.log("Finished database operations.");
        db.$disconnect()
    });