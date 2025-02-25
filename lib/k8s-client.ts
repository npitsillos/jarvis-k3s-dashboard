import * as k8s from "@kubernetes/client-node"
import convert from "convert"

import { Pod } from "@/types"
import { round } from "@/lib/utils"


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
  const numReadyNodes = topNodes.map(item => item.Node.status?.conditions?.filter(condItem => 
    condItem.reason == 'KubeletReady' &&
    condItem.status == 'True'
  )).length
  const [cpuUsage, totalCPU, memoryUsage, totalMemory] = getCPUAndMemoryInfo(topNodes.map(item => (
    {
        memory: item.Memory,
        cpu: item.CPU
    }
  )))
  return {
    nodes: {
      total: numNodes,
      used: numReadyNodes,
    },
    memory: {
        total: totalMemory,
        used: memoryUsage,
    },
    cpu: {
        total: totalCPU,
        used: cpuUsage
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

export async function getPodsInfo() :Promise<Pod[]> {
  const pods = await k8s.topPods(k8sCoreApi, k8sMetricsApi)
  return pods.map<Pod>(pod => ({
    name: pod.Pod.metadata?.name!,
    namespace: pod.Pod.metadata?.namespace!,
    node: pod.Pod.spec?.nodeName!,
    cpuUsage: round((Number(pod.CPU.CurrentUsage) * 1000)) ,
    memoryUsage: round(convert(Number(pod.Memory.CurrentUsage), "bytes").to("GiB"))
  }))
}