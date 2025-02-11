import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const IMAGES: { [key: string]: string } = {
  code: "/vscode.svg",
  longhorn: "/longhorn.svg",
  home: "/homeassistant.png",
  immich: "/immich.png",
}

export default async function Deployments() {
  const res = await fetch("http://localhost:3000/api/custom-deployments")
  const namespacedIngresses: { [key: string]: string[] } = await res.json()
  const ingressToIcon: { [key: string]: string } = {}
  Object.entries(namespacedIngresses).map(([_, ingressHostNames]) => {
    ingressHostNames.forEach(function (ingressHostName) {
      Object.entries(IMAGES).map(([dep, image]) => {
        if (ingressHostName.split(".")[0].includes(dep)) {
          ingressToIcon[ingressHostName] = image
        }
      })
    })
  })
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Custom Deployments
          </h2>
        </div>
        <div className="flex flex-row gap-4">
          {Object.entries(namespacedIngresses).map(
            ([namespace, ingressHostNames]) => {
              return ingressHostNames.map(function (ingressHostName: string) {
                return (
                  <Link
                    href={"https://".concat(ingressHostName)}
                    key={ingressHostName}
                  >
                    <Card key={ingressHostName} className="w-[250px]">
                      <CardHeader>
                        <CardTitle className="flex gap-x-4">
                          <Image
                            className="h-8 w-8 object-contain rounded"
                            src={ingressToIcon[ingressHostName]}
                            width={40}
                            height={40}
                            alt={ingressHostName}
                          />
                          {namespace}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })
            }
          )}
        </div>
      </div>
    </>
  )
}
