import Radial from "@/components/charts/Radial"

export default async function Home() {
  const nodeInfo = await (await fetch("http://localhost:3000/api/metrics")).json()
  console.log(nodeInfo)
  return (
    <div className="flex flex-row justify-between">
        <Radial
            resource="CPU"
            info={nodeInfo.cpu}
        />
        <Radial
            resource="memory (GiB)"
            info={nodeInfo.memory}
        />
        <Radial
            resource="nodes"
            info={{total: nodeInfo.nodes}}
        />
    </div>
  )
}
