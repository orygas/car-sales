import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: car, error } = await supabase
      .from("cars")
      .select(`
        *,
        car_images (
          id,
          url,
          is_primary
        )
      `)
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { images, ...carData } = body;

    // Update car listing
    const { data: car, error: carError } = await supabaseAdmin
      .from("cars")
      .update(carData)
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

    // Update images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await supabaseAdmin
        .from("car_images")
        .delete()
        .eq("car_id", params.id);

      // Insert new images
      const imageRecords = images.map((url: string, index: number) => ({
        car_id: car.id,
        url,
        is_primary: index === 0
      }));

      const { error: imageError } = await supabaseAdmin
        .from("car_images")
        .insert(imageRecords);

      if (imageError) throw imageError;
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
    const { userId } = auth();
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