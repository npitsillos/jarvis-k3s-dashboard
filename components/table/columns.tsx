import { ColumnDef } from "@tanstack/react-table"
import { Pod } from "@/types"


export const columns: ColumnDef<Pod>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "namespace",
        header: "Namespace",
    },
    {
        accessorKey: "node",
        header: "Node"
    },
    {
        accessorKey: "cpuUsage",
        header: "CPU (cores)"
    },
    {
        accessorKey: "memoryUsage",
        header: "Memory (GiB)"
    }
]