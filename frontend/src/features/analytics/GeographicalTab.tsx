import { ResponsiveCalendar } from '@nivo/calendar'
import { ResponsiveSankey } from '@nivo/sankey'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

const MOCK_CALENDAR = Array.from({length: 365}, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - i)
  return {
    day: date.toISOString().split('T')[0],
    value: Math.floor(Math.random() * 100)
  }
})

const MOCK_SANKEY = {
  nodes: [
    { id: "United States", nodeColor: "hsl(214, 70%, 50%)" },
    { id: "India", nodeColor: "hsl(14, 70%, 50%)" },
    { id: "United Kingdom", nodeColor: "hsl(114, 70%, 50%)" },
    { id: "TV-MA", nodeColor: "hsl(284, 70%, 50%)" },
    { id: "TV-14", nodeColor: "hsl(314, 70%, 50%)" },
    { id: "R", nodeColor: "hsl(34, 70%, 50%)" },
    { id: "Movie", nodeColor: "hsl(64, 70%, 50%)" },
    { id: "TV Show", nodeColor: "hsl(164, 70%, 50%)" },
  ],
  links: [
    { source: "United States", target: "TV-MA", value: 800 },
    { source: "United States", target: "R", value: 600 },
    { source: "India", target: "TV-14", value: 500 },
    { source: "India", target: "TV-MA", value: 200 },
    { source: "United Kingdom", target: "TV-MA", value: 400 },
    { source: "TV-MA", target: "TV Show", value: 700 },
    { source: "TV-MA", target: "Movie", value: 700 },
    { source: "TV-14", target: "Movie", value: 300 },
    { source: "TV-14", target: "TV Show", value: 200 },
    { source: "R", target: "Movie", value: 600 },
  ]
}

export default function GeographicalTab({ advanced }: any) {
  if (!advanced) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Content Producing Countries (Horizontal Bar) */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm lg:col-span-1 hover:shadow-md transition-shadow h-[500px]">
          <h3 className="text-lg font-semibold mb-2">Global Sourcing</h3>
          <p className="text-xs text-muted-foreground mb-4">Top 10 Origin Countries by volume.</p>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={advanced.top_countries} layout="vertical" margin={{ top: 0, right: 20, left: 70, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, opacity: 0.8, fill: "currentColor" }} />
                <RechartsTooltip cursor={{fill: 'currentColor', opacity: 0.05}} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sankey Diagram */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm h-[500px] lg:col-span-2 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">International Content Flow</h3>
          <p className="text-xs text-muted-foreground mb-4">Flow from Origin Country &gt; Age Rating &gt; Format.</p>
          <div className="h-[400px]">
             <ResponsiveSankey
                data={MOCK_SANKEY}
                margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
                align="justify"
                colors={{ scheme: 'category10' }}
                nodeOpacity={1}
                nodeHoverOthersOpacity={0.35}
                nodeThickness={18}
                nodeSpacing={24}
                nodeBorderWidth={0}
                nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.8 ] ] }}
                linkOpacity={0.6}
                linkHoverOthersOpacity={0.1}
                linkContract={3}
                enableLinkGradient={true}
                labelPosition="outside"
                labelOrientation="vertical"
                labelPadding={16}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         {/* Calendar Heatmap */}
         <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm h-[350px] lg:col-span-2 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">Platform Ingestion Activity (Calendar)</h3>
          <p className="text-xs text-muted-foreground mb-4">Volume of titles added to the platform daily.</p>
          <div className="h-[250px]">
            <ResponsiveCalendar
                data={MOCK_CALENDAR}
                from={MOCK_CALENDAR[364].day}
                to={MOCK_CALENDAR[0].day}
                emptyColor="hsl(var(--muted))"
                colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                yearSpacing={40}
                monthBorderColor="transparent"
                dayBorderWidth={2}
                dayBorderColor="hsl(var(--card))"
                theme={{
                  text: { fill: 'hsl(var(--foreground))' },
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
                        direction: 'row',
                        translateY: 36,
                        itemCount: 4,
                        itemWidth: 42,
                        itemHeight: 36,
                        itemsSpacing: 14,
                        itemDirection: 'right-to-left'
                    }
                ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
