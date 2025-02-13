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

    // Validate required seller fields
    if (!body.seller_name || !body.seller_phone) {
      return NextResponse.json(
        { error: "Seller name and phone number are required" },
        { status: 400 }
      );
    }

    // Update car listing
    const { data: car, error: carError } = await supabaseAdmin
      .from("cars")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get the listing to verify ownership
    const { data: listing } = await supabase
      .from('cars')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!listing) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (listing.user_id !== userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Delete the listing
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error("Error deleting listing:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error in DELETE /api/cars/[id]:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 