import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts"

export default function QualityMetricsTab({ advanced }: any) {
  if (!advanced) return null

  const runtimeDist = advanced.runtime_dist || []
  const genreMetrics = advanced.genre_metrics || []

  // Format Bubble Data for Nivo ScatterPlot — only if we have data
  const genreBubbleData = genreMetrics.length > 0 ? [
    {
      id: "Genres",
      data: genreMetrics.map((g: any) => ({
        x: g.avg_runtime,
        y: g.value,
        z: g.value,
        genre: g.id
      }))
    }
  ] : [{ id: "Genres", data: [{ x: 0, y: 0 }] }]

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Histogram: Runtime Distribution */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Movie Runtime Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Bell-curve histogram mapping catalog duration buckets.</p>
          <div className="h-[300px]">
            {runtimeDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={runtimeDist} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fontSize: 11, opacity: 0.6 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, opacity: 0.6 }} />
                  <RechartsTooltip cursor={{fill: 'currentColor', opacity: 0.05}} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No runtime data available</div>
            )}
          </div>
        </div>

        {/* Bubble Chart: Genre Quality Matrix */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-2">Genre Quality Matrix</h3>
          <p className="text-xs text-muted-foreground mb-4">Correlation of Genre Volume (Y) vs Average Runtime (X).</p>
          <div className="h-[300px]">
            {genreMetrics.length > 0 ? (
              <ResponsiveScatterPlot
                  data={genreBubbleData}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  yScale={{ type: 'linear', min: 0, max: 'auto' }}
                  blendMode="normal"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                      tickSize: 0,
                      tickPadding: 10,
                      tickRotation: 0,
                      legend: 'Average Runtime (mins)',
                      legendPosition: 'middle',
                      legendOffset: 40
                  }}
                  axisLeft={{
                      tickSize: 0,
                      tickPadding: 10,
                      tickRotation: 0,
                      legend: 'Total Volume',
                      legendPosition: 'middle',
                      legendOffset: -50
                  }}
                  nodeSize={(node: any) => {
                    const z = node?.data?.z
                    return typeof z === 'number' ? Math.max(10, Math.min(60, z / 10)) : 16
                  }}
                  colors={['#ec4899']}
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
                  tooltip={({ node }: any) => {
                    const d = node?.data || {};
                    return (
                      <div className="bg-card text-foreground px-4 py-3 rounded-xl shadow-xl border text-sm flex flex-col gap-1">
                        <strong className="block text-primary">{d.genre || 'Unknown'}</strong>
                        <span className="text-muted-foreground">Volume: <span className="font-semibold text-foreground">{d.y ?? '—'}</span> titles</span>
                        <span className="text-muted-foreground">Avg Duration: <span className="font-semibold text-foreground">{d.x ?? '—'}</span> mins</span>
                      </div>
                    )
                  }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No genre metrics available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Smooth Area Curve for visual density */}
        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-[300px]">
          <h3 className="text-lg font-semibold mb-2">Duration Density Map</h3>
          <p className="text-xs text-muted-foreground mb-4">Smooth distribution curve of the exact runtime buckets.</p>
          <div className="h-[200px]">
            {runtimeDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={runtimeDist} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fontSize: 11, opacity: 0.6 }} />
                  <YAxis hide />
                  <RechartsTooltip cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No runtime data available</div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
