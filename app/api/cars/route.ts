import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query = supabase
      .from("cars")
      .select("*")
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
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in to create a listing" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Create car listing with all fields
    const { data: car, error: carError } = await supabaseAdmin
      .from("cars")
      .insert([{
        user_id: userId,
        make: body.make,
        model: body.model,
        year: body.year,
        price: body.price,
        mileage: body.mileage,
        description: body.description,
        condition: body.condition,
        transmission: body.transmission,
        fuel_type: body.fuel_type,
        location: body.location,
        has_vin: body.has_vin,
        vin: body.vin,
        images: body.images,
        is_damaged: body.is_damaged,
        is_imported: body.is_imported,
        import_country: body.import_country,
        is_first_owner: body.is_first_owner,
        is_accident_free: body.is_accident_free,
        is_registered: body.is_registered,
        is_serviced_at_dealer: body.is_serviced_at_dealer,
        has_tuning: body.has_tuning,
        registration_number: body.registration_number,
        first_registration_date: body.first_registration_date,
        show_registration_info: body.show_registration_info,
        seller_name: body.seller_name,
        seller_phone: body.seller_phone
      }])
      .select()
      .single();

    if (carError) {
      console.error("Error creating car listing:", carError);
      throw new Error("Failed to create car listing in database");
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error creating car listing:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create car listing" },
      { status: 500 }
    );
  }
} 