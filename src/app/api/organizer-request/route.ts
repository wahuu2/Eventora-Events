import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/database";
import User from "@/database/user.model";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      clerkId: userId,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    if (user.role === "organizer") {
      return NextResponse.json(
        {
          success: false,
          message: "You are already an organizer.",
        },
        { status: 400 }
      );
    }

    if (user.role === "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Administrators do not need organizer approval.",
        },
        { status: 400 }
      );
    }

    if (user.organizerRequestStatus === "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Your organizer request is already pending.",
        },
        { status: 400 }
      );
    }

    user.organizerRequestStatus = "pending";

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Your organizer request has been submitted successfully.",
    });
  } catch (error) {
    console.error(
      "Organizer request error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}