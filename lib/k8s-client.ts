import * as k8s from "@kubernetes/client-node"

const METRICS_API = "/apis/metrics.k8s.io/v1beta1/"

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api)

export async function getIngresses(namespaces: string[]) {
  const namespacedIngresses: { [key: string]: string[] } = {}
  for (const namespace of namespaces) {
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
