import { ResponsiveFunnel } from '@nivo/funnel'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { Info } from "lucide-react"

const MOCK_FUNNEL = [
  { id: "Site Visitors", value: 125000, label: "Site Visitors" },
  { id: "Trial Signups", value: 85000, label: "Trial Signups" },
  { id: "Active Viewers", value: 65000, label: "Active Viewers" },
  { id: "Paid Subscribers", value: 42000, label: "Paid Subscribers" },
  { id: "Retained (3mo)", value: 38000, label: "Retained (3mo)" }
]

const MOCK_RETENTION = [
  {
    id: "Cohort A",
    color: "hsl(var(--primary))",
    data: [
      { x: "Month 1", y: 100 }, { x: "Month 2", y: 85 }, { x: "Month 3", y: 78 },
      { x: "Month 4", y: 75 }, { x: "Month 5", y: 72 }, { x: "Month 6", y: 70 }
    ]
  },
  {
    id: "Cohort B",
    color: "hsl(var(--accent))",
    data: [
      { x: "Month 1", y: 100 }, { x: "Month 2", y: 82 }, { x: "Month 3", y: 71 },
      { x: "Month 4", y: 68 }, { x: "Month 5", y: 65 }, { x: "Month 6", y: 63 }
    ]
  }
]

const MOCK_WATERFALL = [
  { step: "Starting ARR", value: 1200000, color: "#6366f1" },
  { step: "New Sales", value: 450000, color: "#10b981" },
  { step: "Expansions", value: 150000, color: "#10b981" },
  { step: "Contractions", value: -50000, color: "#ef4444" },
  { step: "Churn", value: -120000, color: "#ef4444" },
  { step: "Ending ARR", value: 1630000, color: "#6366f1" }
]

export default function AudienceRetentionTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Premium Alert Banner */}
      <div className="p-4 bg-primary/10 border border-primary/20 backdrop-blur-md rounded-2xl flex gap-3 shadow-sm items-start">
        <Info className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-semibold text-primary">Simulation Mode Active</h4>
          <p className="text-sm text-primary/80 mt-1">Because the uploaded dataset only contains content metadata, this intelligence vertical uses highly-realistic simulated business data to demonstrate structural BI capabilities for future live-data integration.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Funnel Chart */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Subscriber Conversion Funnel</h3>
          <p className="text-xs text-muted-foreground mb-4">Drop-off rates from landing page to retained subscriber.</p>
          <div className="h-[300px]">
            <ResponsiveFunnel
              data={MOCK_FUNNEL}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              valueFormat=">-.4s"
              colors={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b']}
              borderWidth={20}
              borderColor="transparent"
              borderOpacity={1}
              labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
              beforeSeparatorLength={100}
              beforeSeparatorOffset={20}
              afterSeparatorLength={100}
              afterSeparatorOffset={20}
              currentPartSizeExtension={10}
              currentBorderWidth={40}
              motionConfig="wobbly"
              theme={{
                tooltip: {
                  container: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Retention Curve */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Cohort Retention Curve</h3>
          <p className="text-xs text-muted-foreground mb-4">Percentage of users retained over a 6-month period.</p>
          <div className="h-[300px]">
            <ResponsiveLine
              data={MOCK_RETENTION}
              margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 100, stacked: false, reverse: false }}
              yFormat=" >-.0f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  tickSize: 0,
                  tickPadding: 10,
                  tickRotation: 0,
                  legend: 'Months Since Signup',
                  legendOffset: 40,
                  legendPosition: 'middle'
              }}
              axisLeft={{
                  tickSize: 0,
                  tickPadding: 10,
                  tickRotation: 0,
                  legend: '% Retained',
                  legendOffset: -45,
                  legendPosition: 'middle'
              }}
              pointSize={12}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={3}
              pointBorderColor={{ from: 'serieColor' }}
              useMesh={true}
              enableGridX={false}
              colors={['#14b8a6', '#f59e0b']}
              lineWidth={4}
              theme={{
                axis: { ticks: { text: { fill: 'currentColor', opacity: 0.6 } }, legend: { text: { fill: 'currentColor', opacity: 0.8, fontWeight: 500 } } },
                grid: { line: { stroke: 'currentColor', strokeDasharray: '4 4', opacity: 0.1 } },
                tooltip: {
                  container: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                    fontSize: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }
                }
              }}
              legends={[
                  {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 100,
                      translateY: 0,
                      itemsSpacing: 0,
                      itemDirection: 'left-to-right',
                      itemWidth: 80,
                      itemHeight: 20,
                      itemOpacity: 0.8,
                      symbolSize: 14,
                      symbolShape: 'circle',
                      itemTextColor: 'currentColor'
                  }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Waterfall Chart (using Bar hack) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">ARR Revenue Bridge (Waterfall)</h3>
          <p className="text-xs text-muted-foreground mb-4">Year-to-date Annual Recurring Revenue changes.</p>
          <div className="h-[300px]">
             <ResponsiveBar
                data={MOCK_WATERFALL}
                keys={['value']}
                indexBy="step"
                margin={{ top: 20, right: 30, bottom: 50, left: 80 }}
                padding={0.4}
                colors={({ data }) => data.color as string}
                borderRadius={4}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: 'ARR Milestones',
                    legendPosition: 'middle',
                    legendOffset: 40
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: 'Revenue ($)',
                    legendPosition: 'middle',
                    legendOffset: -65,
                    format: '$.2s'
                }}
                enableGridX={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                role="application"
                theme={{
                  axis: { ticks: { text: { fill: 'currentColor', opacity: 0.6 } }, legend: { text: { fill: 'currentColor', opacity: 0.8, fontWeight: 500 } } },
                  grid: { line: { stroke: 'currentColor', strokeDasharray: '4 4', opacity: 0.1 } },
                  tooltip: {
                    container: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }
                  }
                }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
