import connect from "../../../../../lib/db";
import { NextResponse } from "next/server";
import User from "../../../../../lib/modals/user";

export const GET = () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
};