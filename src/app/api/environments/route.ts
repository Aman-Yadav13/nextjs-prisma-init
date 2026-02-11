import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email?.endsWith("@saviynt.com")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const environments = await prisma.environment.findMany({
      select: {
        slug: true,
        cloud_platform: true,
        region: true,
        account_id: true,
        customer_name: true,
        environment: true,
        type: true,
        web_url: true,
        application: {
          select: {
            ispm_enabled: true,
            pam_enabled: true,
          },
        },
      },
      orderBy: {
        slug: "asc",
      },
    });

    const formattedData = environments.map((env) => ({
      slug: env.slug,
      cloud_platform: env.cloud_platform,
      region: env.region,
      account_id: env.account_id,
      customer_name: env.customer_name,
      environment: env.environment,
      type: env.type,
      web_url: env.web_url,
      ispm_enabled: env.application?.ispm_enabled || false,
      pam_enabled: env.application?.pam_enabled || false,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch environments" },
      { status: 500 }
    );
  }
}
