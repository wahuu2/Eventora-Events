import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import User from "@/database/user.model";

export async function GET() {
  try {
    const result = await requireAdmin();

    if (!result.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.status }
      );
    }

    const organizers = await User.find({
      role: "organizer",
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    const pendingRequests = await User.find({
      role: "user",
      organizerRequestStatus: "pending",
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      organizers,
      pendingRequests,
      count: organizers.length,
      pendingCount: pendingRequests.length,
    });
  } catch (error) {
    console.error("Admin organizers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const result = await requireAdmin();

    if (!result.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.status }
      );
    }

    const body = await request.json();

    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID and action are required.",
        },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (user.organizerRequestStatus !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "This organizer request is not pending.",
        },
        { status: 400 }
      );
    }

    if (action === "approve") {
      user.role = "organizer";
      user.organizerRequestStatus = "approved";

      await user.save();

      return NextResponse.json({
        success: true,
        message: "Organizer request approved successfully.",
      });
    }

    user.role = "user";
    user.organizerRequestStatus = "rejected";

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Organizer request rejected.",
    });
  } catch (error) {
    console.error("Admin organizer action error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}