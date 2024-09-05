import { dbConnect } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await dbConnect();
    console.log("Connected to the database successfully");
    // Your database logic here
    return NextResponse.json({ message: "Connected to MongoDB successfully!" });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return NextResponse.json({ message: "Error connecting to the database" }, { status: 500 });
  }
}