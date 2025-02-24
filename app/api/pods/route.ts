import { getPodsInfo } from "@/lib/k8s-client"

export async function GET() {
  const podsInfo = await getPodsInfo()
  return Response.json(podsInfo)
}
