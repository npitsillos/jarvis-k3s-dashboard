"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
    Card,
    CardContent,
  } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

type Props = {
    resource: string
    info: {
        total: number
        used?: number
    }
}
function getChartConfig(resource: string) {
    return {
        [resource]: {
            label: resource.charAt(0).toUpperCase() + resource.slice(1),
        },
    } satisfies ChartConfig
}

function getChartData(resource: string, num: number) {
    return [
        {
            [resource]: num,
            fill: "hsl(var(--chart-2))"
        }
    ]
}

function getEndAngle(resource: string, info: {total: number, used?: number}) {
    if (resource === "nodes") {
        return -180
    }
    return  180 - ((360 / info.total) * (info.used ?? 0))
}

export default function Radial({resource, info}: Props) {
  return (
      <Card className="flex flex-col shadow-none border-none">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={getChartConfig(resource)}
          className="mx-auto aspect-square max-h-[250px]"
          style={{ height: 200, width: "100%"}}
        >
          <RadialBarChart
            data={getChartData(resource, info.total)}
            startAngle={180}
            endAngle={getEndAngle(resource, info)}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
                gridType="circle"
                radialLines={true}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
            />
            <RadialBar dataKey={resource} background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {info.total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          { resource.charAt(0).toUpperCase() + resource.slice(1) }
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
