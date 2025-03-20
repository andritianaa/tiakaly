import { NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET() {
  try {
    const types = await prisma.placeType.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching place types:", error);
    return NextResponse.json(
      { error: "Failed to fetch place types" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Vérifier si le type existe déjà
    const existingType = await prisma.placeType.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Recherche insensible à la casse
        },
      },
    });

    if (existingType) {
      return NextResponse.json(
        { error: "Ce type d'endroit existe déjà" },
        { status: 400 }
      );
    }

    // Créer le nouveau type
    const newType = await prisma.placeType.create({
      data: {
        name,
        value: name.toLowerCase().replace(/\s+/g, "_"), // Convertir en format valeur (snake_case)
      },
    });

    return NextResponse.json(newType);
  } catch (error) {
    console.error("Error creating place type:", error);
    return NextResponse.json(
      { error: "Failed to create place type" },
      { status: 500 }
    );
  }
}
