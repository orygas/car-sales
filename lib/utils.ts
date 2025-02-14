import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/lib/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CarMake {
  id: string;
  name: string;
}

export interface CarModel {
  id: string;
  name: string;
  make_id: string;
}

export interface LocationSuggestion {
  display_name: string;
  city?: string;
  country: string;
  formatted_location: string;
}

export async function getLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=at,be,bg,hr,cy,cz,dk,ee,fi,fr,de,gr,hu,ie,it,lv,lt,lu,mt,nl,pl,pt,ro,sk,si,es,se&limit=5&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch locations');

    const data = await response.json();
    
    return data
      .map((item: { address: { city?: string; town?: string; village?: string; country: string; }; display_name: string; }) => {
        const city = item.address.city || item.address.town || item.address.village;
        const country = item.address.country;
        
        return {
          display_name: item.display_name,
          city,
          country,
          formatted_location: city ? `${city}, ${country}` : country
        };
      })
      .filter((item: LocationSuggestion) => item.city)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    return [];
  }
}

export async function getCarMakes(): Promise<CarMake[]> {
  const { data, error } = await supabase
    .from('car_makes')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching car makes:', error);
    return [];
  }

  return data;
}

export async function getCarModels(makeId: string): Promise<CarModel[]> {
  const { data, error } = await supabase
    .from('car_models')
    .select('*')
    .eq('make_id', makeId)
    .order('name');

  if (error) {
    console.error('Error fetching car models:', error);
    return [];
  }

  return data;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('pl-PL').format(price)
}
