import Radial from "@/components/charts/Radial"
import { DataTable } from "@/components/table/table"
import { columns } from "@/components/table/columns"

export default async function Home() {
  const nodeInfo = await (await fetch("http://localhost:3000/api/metrics")).json()
  const podInfo = await (await fetch("http://localhost:3000/api/pods")).json()
  return (
    <>
    <div className="flex flex-row justify-center">
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
            info={nodeInfo.nodes}
        />
    </div>
    <div className="container mx-auto py-10">
        <DataTable columns={columns} data={podInfo}/>
    </div>
    </>
  )
}
