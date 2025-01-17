import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query = supabase
      .from("cars")
      .select(`
        *,
        car_images (
          id,
          url,
          is_primary
        )
      `)
      .order("created_at", { ascending: false });

    if (make) query = query.eq("make", make);
    if (model) query = query.eq("model", model);
    if (minPrice) query = query.gte("price", minPrice);
    if (maxPrice) query = query.lte("price", maxPrice);

    const { data: cars, error } = await query;

    if (error) throw error;

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    // Insert car listing
    const { data: car, error: carError } = await supabaseAdmin
      .from("cars")
      .insert([{ ...carData, user_id: userId }])
      .select()
      .single();

    if (carError) throw carError;

    // Insert car images if any
    if (images && images.length > 0) {
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
    console.error("Error creating car listing:", error);
    return NextResponse.json(
      { error: "Failed to create car listing" },
      { status: 500 }
    );
  }
} 