import { auth } from "@/auth";

export default async function TestToken() {
  const session = await auth();
  return <pre>{session?.id_token}</pre>;
}
