import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth();

  if (!session?.user?.email?.endsWith("@saviynt.com")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const environment = await prisma.environment.findUnique({
      where: { slug: params.slug },
      include: {
        infrastructure: true,
        cluster: true,
        data_store: true,
        application: true,
      },
    });

    if (!environment) {
      return NextResponse.json(
        { error: "Environment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(environment);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch environment" },
      { status: 500 }
    );
  }
}
