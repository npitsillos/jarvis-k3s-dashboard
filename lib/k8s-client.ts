import * as k8s from "@kubernetes/client-node"
import convert from "convert"

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api)
const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api)
const k8sNodeApi = kc.makeApiClient(k8s.NodeApi)
const k8sMetricsApi = new k8s.Metrics(kc)

const EXCLUDED_NAMESPACES = [
  "cert-manager",
  "default",
  "ingress-nginx",
  "kube-node-lease",
  "kube-public",
  "kube-system",
  "nfd-system",
]

async function getCustomDeploymentNamespaces() {
  const customNamespaces: string[] = []
  const namespaces = await k8sCoreApi.listNamespace()
  for (const namespace of namespaces.body.items) {
    if (EXCLUDED_NAMESPACES.includes(namespace.metadata?.name!)) {
      continue
    }
    customNamespaces.push(namespace.metadata?.name!)
  }
  return customNamespaces
}

export async function getIngresses() {
  const namespacedIngresses: { [key: string]: string[] } = {}
  for (const namespace of await getCustomDeploymentNamespaces()) {
    const ingresses = await k8sNetworkingApi.listNamespacedIngress(namespace)
    namespacedIngresses[namespace] = []
    ingresses.body.items.map((ingress) => {
      const ingressHostName = ingress.spec?.rules?.at(0)?.host
      if (!ingressHostName) return
      namespacedIngresses[namespace].push(ingressHostName)
    })
  }
  return namespacedIngresses
}

export async function getClusterBasicInfo() {
  const topNodes = await k8s.topNodes(k8sCoreApi)
  const numNodes = topNodes.length
  const [cpuUsage, totalCPU, memoryUsage, totalMemory] = getCPUAndMemoryInfo(topNodes.map(item => (
    {
        memory: item.Memory,
        cpu: item.CPU
    }
  )))
  return {
    nodes: numNodes,
    memory: {
        total: Math.round(totalMemory * 100) / 100,
        used: Math.round(memoryUsage * 100) / 100,
    },
    cpu: {
        total: totalCPU,
        used: Math.round(cpuUsage * 100) / 100
    }
  }
}

function getCPUAndMemoryInfo(topNodesCPU: Array<{cpu: k8s.ResourceUsage, memory: k8s.ResourceUsage}>) {
    let [cpuUsage, totalCPU, memoryUsage, totalMemory] = [0, 0, 0, 0]
    for (const nodeInfo of topNodesCPU) {
        cpuUsage += nodeInfo.cpu.RequestTotal as number
        totalCPU += nodeInfo.cpu.Capacity as number
        memoryUsage += Number(nodeInfo.memory.RequestTotal)
        totalMemory += Number(nodeInfo.memory.Capacity)
    }
    return [cpuUsage, totalCPU, convert(memoryUsage, "bytes").to("GiB"), convert(totalMemory, "bytes").to("GiB")]
}