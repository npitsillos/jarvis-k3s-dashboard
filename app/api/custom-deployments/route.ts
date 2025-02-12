import { getIngresses } from "@/lib/k8s-client"

export async function GET() {
  const ingresses = await getIngresses()
  return Response.json(ingresses)
}
