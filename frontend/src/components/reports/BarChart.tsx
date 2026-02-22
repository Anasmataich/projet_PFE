interface BarChartProps {
  data: { label: string; value: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">Aucune donnée</p>;

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-700 font-medium">{d.label}</span>
            <span className="text-gray-500">{d.value}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
