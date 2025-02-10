import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { data: car, error } = await supabase
      .from("cars")
      .select('*')
      .eq("id", params.id)
      .single();

    if (error) throw error;
    if (!car) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { error: "Failed to fetch car" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Update car listing
    const { data: car, error: carError } = await supabaseAdmin
      .from("cars")
      .update(body)
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (carError) throw carError;
    if (!car) {
      return NextResponse.json(
        { error: "Car not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabaseAdmin
      .from("cars")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
} 