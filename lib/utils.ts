import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
  makeId: string;
}

const EUROPEAN_MAKES = [
  { id: "audi", name: "Audi" },
  { id: "bmw", name: "BMW" },
  { id: "mercedes", name: "Mercedes-Benz" },
  { id: "volkswagen", name: "Volkswagen" },
  { id: "porsche", name: "Porsche" },
  { id: "volvo", name: "Volvo" },
  { id: "ferrari", name: "Ferrari" },
  { id: "lamborghini", name: "Lamborghini" },
  { id: "maserati", name: "Maserati" },
  { id: "alfa-romeo", name: "Alfa Romeo" },
  { id: "bentley", name: "Bentley" },
  { id: "bugatti", name: "Bugatti" },
  { id: "jaguar", name: "Jaguar" },
  { id: "land-rover", name: "Land Rover" },
  { id: "mini", name: "MINI" },
  { id: "rolls-royce", name: "Rolls-Royce" },
  { id: "peugeot", name: "Peugeot" },
  { id: "renault", name: "Renault" },
  { id: "citroen", name: "Citroën" },
  { id: "ds", name: "DS" },
  { id: "fiat", name: "Fiat" },
  { id: "seat", name: "SEAT" },
  { id: "skoda", name: "Škoda" },
  { id: "smart", name: "Smart" },
  { id: "opel", name: "Opel" },
  { id: "vauxhall", name: "Vauxhall" },
].sort((a, b) => a.name.localeCompare(b.name));

const CAR_MODELS: Record<string, CarModel[]> = {
  "audi": [
    { id: "a1", name: "A1", makeId: "audi" },
    { id: "a3", name: "A3", makeId: "audi" },
    { id: "a4", name: "A4", makeId: "audi" },
    { id: "a5", name: "A5", makeId: "audi" },
    { id: "a6", name: "A6", makeId: "audi" },
    { id: "a7", name: "A7", makeId: "audi" },
    { id: "a8", name: "A8", makeId: "audi" },
    { id: "q2", name: "Q2", makeId: "audi" },
    { id: "q3", name: "Q3", makeId: "audi" },
    { id: "q5", name: "Q5", makeId: "audi" },
    { id: "q7", name: "Q7", makeId: "audi" },
    { id: "q8", name: "Q8", makeId: "audi" },
    { id: "e-tron", name: "e-tron", makeId: "audi" },
    { id: "rs3", name: "RS3", makeId: "audi" },
    { id: "rs4", name: "RS4", makeId: "audi" },
    { id: "rs5", name: "RS5", makeId: "audi" },
    { id: "rs6", name: "RS6", makeId: "audi" },
    { id: "rs7", name: "RS7", makeId: "audi" },
    { id: "tt", name: "TT", makeId: "audi" },
    { id: "r8", name: "R8", makeId: "audi" },
  ],
  "bmw": [
    { id: "1-series", name: "1 Series", makeId: "bmw" },
    { id: "2-series", name: "2 Series", makeId: "bmw" },
    { id: "3-series", name: "3 Series", makeId: "bmw" },
    { id: "4-series", name: "4 Series", makeId: "bmw" },
    { id: "5-series", name: "5 Series", makeId: "bmw" },
    { id: "6-series", name: "6 Series", makeId: "bmw" },
    { id: "7-series", name: "7 Series", makeId: "bmw" },
    { id: "8-series", name: "8 Series", makeId: "bmw" },
    { id: "x1", name: "X1", makeId: "bmw" },
    { id: "x2", name: "X2", makeId: "bmw" },
    { id: "x3", name: "X3", makeId: "bmw" },
    { id: "x4", name: "X4", makeId: "bmw" },
    { id: "x5", name: "X5", makeId: "bmw" },
    { id: "x6", name: "X6", makeId: "bmw" },
    { id: "x7", name: "X7", makeId: "bmw" },
    { id: "z4", name: "Z4", makeId: "bmw" },
    { id: "i3", name: "i3", makeId: "bmw" },
    { id: "i4", name: "i4", makeId: "bmw" },
    { id: "i8", name: "i8", makeId: "bmw" },
    { id: "ix", name: "iX", makeId: "bmw" },
    { id: "m2", name: "M2", makeId: "bmw" },
    { id: "m3", name: "M3", makeId: "bmw" },
    { id: "m4", name: "M4", makeId: "bmw" },
    { id: "m5", name: "M5", makeId: "bmw" },
    { id: "m8", name: "M8", makeId: "bmw" },
  ],
  "mercedes": [
    { id: "a-class", name: "A-Class", makeId: "mercedes" },
    { id: "b-class", name: "B-Class", makeId: "mercedes" },
    { id: "c-class", name: "C-Class", makeId: "mercedes" },
    { id: "e-class", name: "E-Class", makeId: "mercedes" },
    { id: "s-class", name: "S-Class", makeId: "mercedes" },
    { id: "cls", name: "CLS", makeId: "mercedes" },
    { id: "gla", name: "GLA", makeId: "mercedes" },
    { id: "glb", name: "GLB", makeId: "mercedes" },
    { id: "glc", name: "GLC", makeId: "mercedes" },
    { id: "gle", name: "GLE", makeId: "mercedes" },
    { id: "gls", name: "GLS", makeId: "mercedes" },
    { id: "sl", name: "SL", makeId: "mercedes" },
    { id: "amg-gt", name: "AMG GT", makeId: "mercedes" },
    { id: "eqc", name: "EQC", makeId: "mercedes" },
    { id: "eqs", name: "EQS", makeId: "mercedes" },
  ],
  "volkswagen": [
    { id: "golf", name: "Golf", makeId: "volkswagen" },
    { id: "polo", name: "Polo", makeId: "volkswagen" },
    { id: "tiguan", name: "Tiguan", makeId: "volkswagen" },
    { id: "passat", name: "Passat", makeId: "volkswagen" },
    { id: "arteon", name: "Arteon", makeId: "volkswagen" },
    { id: "touareg", name: "Touareg", makeId: "volkswagen" },
    { id: "t-roc", name: "T-Roc", makeId: "volkswagen" },
    { id: "t-cross", name: "T-Cross", makeId: "volkswagen" },
    { id: "id3", name: "ID.3", makeId: "volkswagen" },
    { id: "id4", name: "ID.4", makeId: "volkswagen" },
    { id: "id5", name: "ID.5", makeId: "volkswagen" },
    { id: "taigo", name: "Taigo", makeId: "volkswagen" },
  ],
  "porsche": [
    { id: "911", name: "911", makeId: "porsche" },
    { id: "cayenne", name: "Cayenne", makeId: "porsche" },
    { id: "macan", name: "Macan", makeId: "porsche" },
    { id: "panamera", name: "Panamera", makeId: "porsche" },
    { id: "taycan", name: "Taycan", makeId: "porsche" },
    { id: "718-cayman", name: "718 Cayman", makeId: "porsche" },
    { id: "718-boxster", name: "718 Boxster", makeId: "porsche" },
  ],
  "volvo": [
    { id: "xc40", name: "XC40", makeId: "volvo" },
    { id: "xc60", name: "XC60", makeId: "volvo" },
    { id: "xc90", name: "XC90", makeId: "volvo" },
    { id: "s60", name: "S60", makeId: "volvo" },
    { id: "s90", name: "S90", makeId: "volvo" },
    { id: "v60", name: "V60", makeId: "volvo" },
    { id: "v90", name: "V90", makeId: "volvo" },
    { id: "c40", name: "C40", makeId: "volvo" },
  ],
  "ferrari": [
    { id: "f8", name: "F8", makeId: "ferrari" },
    { id: "sf90", name: "SF90", makeId: "ferrari" },
    { id: "roma", name: "Roma", makeId: "ferrari" },
    { id: "portofino", name: "Portofino", makeId: "ferrari" },
    { id: "812", name: "812", makeId: "ferrari" },
    { id: "296", name: "296", makeId: "ferrari" },
    { id: "purosangue", name: "Purosangue", makeId: "ferrari" },
  ],
  "lamborghini": [
    { id: "huracan", name: "Huracán", makeId: "lamborghini" },
    { id: "aventador", name: "Aventador", makeId: "lamborghini" },
    { id: "urus", name: "Urus", makeId: "lamborghini" },
    { id: "revuelto", name: "Revuelto", makeId: "lamborghini" },
  ],
  "maserati": [
    { id: "ghibli", name: "Ghibli", makeId: "maserati" },
    { id: "quattroporte", name: "Quattroporte", makeId: "maserati" },
    { id: "levante", name: "Levante", makeId: "maserati" },
    { id: "mc20", name: "MC20", makeId: "maserati" },
    { id: "grecale", name: "Grecale", makeId: "maserati" },
  ],
  "alfa-romeo": [
    { id: "giulia", name: "Giulia", makeId: "alfa-romeo" },
    { id: "stelvio", name: "Stelvio", makeId: "alfa-romeo" },
    { id: "tonale", name: "Tonale", makeId: "alfa-romeo" },
  ],
  "jaguar": [
    { id: "f-pace", name: "F-PACE", makeId: "jaguar" },
    { id: "e-pace", name: "E-PACE", makeId: "jaguar" },
    { id: "i-pace", name: "I-PACE", makeId: "jaguar" },
    { id: "f-type", name: "F-TYPE", makeId: "jaguar" },
    { id: "xe", name: "XE", makeId: "jaguar" },
    { id: "xf", name: "XF", makeId: "jaguar" },
  ],
  "land-rover": [
    { id: "range-rover", name: "Range Rover", makeId: "land-rover" },
    { id: "range-rover-sport", name: "Range Rover Sport", makeId: "land-rover" },
    { id: "range-rover-velar", name: "Range Rover Velar", makeId: "land-rover" },
    { id: "range-rover-evoque", name: "Range Rover Evoque", makeId: "land-rover" },
    { id: "discovery", name: "Discovery", makeId: "land-rover" },
    { id: "discovery-sport", name: "Discovery Sport", makeId: "land-rover" },
    { id: "defender", name: "Defender", makeId: "land-rover" },
  ],
  "bentley": [
    { id: "continental-gt", name: "Continental GT", makeId: "bentley" },
    { id: "flying-spur", name: "Flying Spur", makeId: "bentley" },
    { id: "bentayga", name: "Bentayga", makeId: "bentley" },
  ],
  "rolls-royce": [
    { id: "phantom", name: "Phantom", makeId: "rolls-royce" },
    { id: "ghost", name: "Ghost", makeId: "rolls-royce" },
    { id: "cullinan", name: "Cullinan", makeId: "rolls-royce" },
    { id: "spectre", name: "Spectre", makeId: "rolls-royce" },
  ],
  "peugeot": [
    { id: "208", name: "208", makeId: "peugeot" },
    { id: "2008", name: "2008", makeId: "peugeot" },
    { id: "308", name: "308", makeId: "peugeot" },
    { id: "3008", name: "3008", makeId: "peugeot" },
    { id: "408", name: "408", makeId: "peugeot" },
    { id: "508", name: "508", makeId: "peugeot" },
    { id: "5008", name: "5008", makeId: "peugeot" },
  ],
  "renault": [
    { id: "clio", name: "Clio", makeId: "renault" },
    { id: "captur", name: "Captur", makeId: "renault" },
    { id: "megane", name: "Megane", makeId: "renault" },
    { id: "arkana", name: "Arkana", makeId: "renault" },
    { id: "austral", name: "Austral", makeId: "renault" },
    { id: "espace", name: "Espace", makeId: "renault" },
    { id: "scenic", name: "Scenic", makeId: "renault" },
  ],
  "citroen": [
    { id: "c3", name: "C3", makeId: "citroen" },
    { id: "c4", name: "C4", makeId: "citroen" },
    { id: "c5-x", name: "C5 X", makeId: "citroen" },
    { id: "c5-aircross", name: "C5 Aircross", makeId: "citroen" },
    { id: "berlingo", name: "Berlingo", makeId: "citroen" },
    { id: "spacetourer", name: "SpaceTourer", makeId: "citroen" },
  ],
  "skoda": [
    { id: "fabia", name: "Fabia", makeId: "skoda" },
    { id: "octavia", name: "Octavia", makeId: "skoda" },
    { id: "superb", name: "Superb", makeId: "skoda" },
    { id: "kamiq", name: "Kamiq", makeId: "skoda" },
    { id: "karoq", name: "Karoq", makeId: "skoda" },
    { id: "kodiaq", name: "Kodiaq", makeId: "skoda" },
    { id: "enyaq", name: "Enyaq", makeId: "skoda" },
    { id: "scala", name: "Scala", makeId: "skoda" },
  ],
  "seat": [
    { id: "ibiza", name: "Ibiza", makeId: "seat" },
    { id: "leon", name: "Leon", makeId: "seat" },
    { id: "arona", name: "Arona", makeId: "seat" },
    { id: "ateca", name: "Ateca", makeId: "seat" },
    { id: "tarraco", name: "Tarraco", makeId: "seat" },
  ],
  "fiat": [
    { id: "500", name: "500", makeId: "fiat" },
    { id: "500x", name: "500X", makeId: "fiat" },
    { id: "tipo", name: "Tipo", makeId: "fiat" },
    { id: "panda", name: "Panda", makeId: "fiat" },
  ],
  "mini": [
    { id: "3-door", name: "3-Door", makeId: "mini" },
    { id: "5-door", name: "5-Door", makeId: "mini" },
    { id: "clubman", name: "Clubman", makeId: "mini" },
    { id: "countryman", name: "Countryman", makeId: "mini" },
    { id: "convertible", name: "Convertible", makeId: "mini" },
  ],
  "smart": [
    { id: "fortwo", name: "fortwo", makeId: "smart" },
    { id: "1", name: "#1", makeId: "smart" },
    { id: "3", name: "#3", makeId: "smart" },
  ],
  "opel": [
    { id: "corsa", name: "Corsa", makeId: "opel" },
    { id: "astra", name: "Astra", makeId: "opel" },
    { id: "mokka", name: "Mokka", makeId: "opel" },
    { id: "crossland", name: "Crossland", makeId: "opel" },
    { id: "grandland", name: "Grandland", makeId: "opel" },
  ],
  // Vauxhall models are same as Opel, just different branding for UK
  "vauxhall": [
    { id: "corsa", name: "Corsa", makeId: "vauxhall" },
    { id: "astra", name: "Astra", makeId: "vauxhall" },
    { id: "mokka", name: "Mokka", makeId: "vauxhall" },
    { id: "crossland", name: "Crossland", makeId: "vauxhall" },
    { id: "grandland", name: "Grandland", makeId: "vauxhall" },
  ],
  "ds": [
    { id: "3", name: "3", makeId: "ds" },
    { id: "4", name: "4", makeId: "ds" },
    { id: "7", name: "7", makeId: "ds" },
    { id: "9", name: "9", makeId: "ds" },
  ],
  "bugatti": [
    { id: "chiron", name: "Chiron", makeId: "bugatti" },
    { id: "mistral", name: "Mistral", makeId: "bugatti" },
  ],
};

export async function getCarMakes(): Promise<CarMake[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return EUROPEAN_MAKES;
}

export async function getCarModels(makeId: string): Promise<CarModel[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return CAR_MODELS[makeId] || [];
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('pl-PL').format(price)
}
