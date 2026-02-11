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
        cloud_platform: true,
        account_id: true,
        environment: true,
        application: {
          select: {
            pam_enabled: true,
            ispm_enabled: true,
          },
        },
      },
    });

    const azureSubscriptions = await prisma.azureSubscription.findMany({
      select: {
        id: true,
        is_internal: true,
      },
    });

    const internalAzureSubIds = new Set(
      azureSubscriptions.filter(sub => sub.is_internal).map(sub => sub.id)
    );

    const totalEnv = environments.length;
    const totalAwsEnv = environments.filter(
      (env) => env.cloud_platform === "aws",
    ).length;
    const totalAzureEnv = environments.filter(
      (env) => env.cloud_platform === "azure",
    ).length;
    
    const awsInternalEnv = environments.filter(
      (env) => env.cloud_platform === "aws" && env.account_id === "249469748895"
    ).length;
    
    const azureInternalEnv = environments.filter(
      (env) => env.cloud_platform === "azure" && internalAzureSubIds.has(env.account_id)
    ).length;
    
    const totalInternalEnv = awsInternalEnv + azureInternalEnv;

    const customerEnvs = environments.filter(
      (env) => {
        if (env.cloud_platform === "aws") {
          return env.account_id !== "249469748895";
        }
        if (env.cloud_platform === "azure") {
          return !internalAzureSubIds.has(env.account_id);
        }
        return true;
      }
    );
    const totalCustomerEnv = customerEnvs.length;
    
    const awsCustomerEnvs = customerEnvs.filter(env => env.cloud_platform === "aws");
    const azureCustomerEnvs = customerEnvs.filter(env => env.cloud_platform === "azure");
    
    const awsCustomerProd = awsCustomerEnvs.filter(env => 
      env.environment.toLowerCase().startsWith("prod")
    ).length;
    const azureCustomerProd = azureCustomerEnvs.filter(env => 
      env.environment.toLowerCase().startsWith("prod")
    ).length;
    
    const customerProdEnv = awsCustomerProd + azureCustomerProd;
    const awsCustomerNonProd = awsCustomerEnvs.length - awsCustomerProd;
    const azureCustomerNonProd = azureCustomerEnvs.length - azureCustomerProd;
    const customerNonProdEnv = awsCustomerNonProd + azureCustomerNonProd;

    const totalPamEnabled = environments.filter(
      (env) => env.application?.pam_enabled,
    ).length;
    const totalIspmEnabled = environments.filter(
      (env) => env.application?.ispm_enabled,
    ).length;

    return NextResponse.json({
      totalEnv,
      totalAwsEnv,
      totalAzureEnv,
      totalInternalEnv,
      awsInternalEnv,
      azureInternalEnv,
      totalCustomerEnv,
      customerProdEnv,
      awsCustomerProd,
      azureCustomerProd,
      customerNonProdEnv,
      awsCustomerNonProd,
      azureCustomerNonProd,
      totalPamEnabled,
      totalIspmEnabled,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
