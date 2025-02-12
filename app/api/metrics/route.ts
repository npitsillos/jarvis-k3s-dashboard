import { getClusterBasicInfo } from "@/lib/k8s-client"

export async function GET() {
  const clusterInfo = await getClusterBasicInfo()
  return Response.json(clusterInfo)
}
