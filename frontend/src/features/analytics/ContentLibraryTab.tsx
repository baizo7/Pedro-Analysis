import { ResponsiveTreeMap } from '@nivo/treemap'
import { ResponsiveRadar } from '@nivo/radar'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"

export default function ContentLibraryTab({ advanced }: any) {
  if (!advanced) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Top Cast & Crew Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Most Prolific Directors</h3>
          <p className="text-xs text-muted-foreground mb-4">Top 10 directors by volume of catalog entries.</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={advanced.top_directors} layout="vertical" margin={{ top: 0, right: 20, left: 100, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, opacity: 0.8, fill: "currentColor" }} />
                <RechartsTooltip cursor={{fill: 'currentColor', opacity: 0.05}} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Most Frequent Cast Members</h3>
          <p className="text-xs text-muted-foreground mb-4">Top 10 actors by appearances in the global catalog.</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={advanced.top_actors} layout="vertical" margin={{ top: 0, right: 20, left: 100, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="currentColor" className="opacity-10" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, opacity: 0.8, fill: "currentColor" }} />
                <RechartsTooltip cursor={{fill: 'currentColor', opacity: 0.05}} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scatter Plot: Year vs Duration */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Movie Duration Matrix</h3>
          <p className="text-xs text-muted-foreground mb-4">Release Year vs. Runtime Duration (Sampled 200).</p>
          <div className="h-[300px]">
            <ResponsiveScatterPlot
              data={[
                {
                  id: "Movies",
                  data: advanced.scatter.map((d: any) => ({
                    x: d.year,
                    y: d.duration,
                    title: d.title
                  }))
                }
              ]}
              margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
              xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
              yScale={{ type: 'linear', min: 0, max: 'auto' }}
              blendMode="normal"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Release Year',
                legendPosition: 'middle',
                legendOffset: 30
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
                legend: 'Duration (mins)',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              colors={['#14b8a6']}
              nodeSize={8}
              useMesh={true}
              theme={{
                axis: { ticks: { text: { fill: 'currentColor', opacity: 0.5 } } },
                grid: { line: { stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.1 } }
              }}
              tooltip={({ node }) => {
                const data = node.data as any;
                return (
                  <div className="bg-card text-foreground px-4 py-3 rounded-xl shadow-xl border text-sm">
                    <strong className="block mb-1">{data.title}</strong>
                    <span className="text-muted-foreground">{data.formattedX} • {data.formattedY} mins</span>
                  </div>
                )
              }}
            />
          </div>
        </div>

        {/* Radar Chart: Genres */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Genre Dominance Profile</h3>
          <p className="text-xs text-muted-foreground mb-4">Volume mapping of the top 6 global genres.</p>
          <div className="h-[300px]">
            <ResponsiveRadar
              data={advanced.radar}
              keys={['A']}
              indexBy="subject"
              valueFormat=">-.0f"
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              borderColor={{ from: 'color' }}
              gridLabelOffset={24}
              dotSize={10}
              dotColor={{ theme: 'background' }}
              dotBorderWidth={3}
              colors={['#6366f1']}
              blendMode="normal"
              motionConfig="gentle"
              theme={{
                axis: { ticks: { text: { fill: 'currentColor', opacity: 0.8, fontWeight: 500 } } },
                grid: { line: { stroke: 'currentColor', opacity: 0.1 } }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Treemap: Countries */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[500px]">
          <h3 className="text-lg font-semibold mb-2">Global Sourcing Hierarchy (Treemap)</h3>
          <p className="text-xs text-muted-foreground mb-4">Nested breakdown of top origin countries by format volume.</p>
          <div className="h-[400px]">
            <ResponsiveTreeMap
              data={advanced.treemap[0]}
              identity="name"
              value="size"
              valueFormat=".0f"
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              labelSkipSize={16}
              labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              parentLabelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
              colors={{ scheme: 'pastel1' }}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
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
    </div>
  )
}
