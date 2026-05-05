import { useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function BatteryHealthTracker() {
  const [originalRange, setOriginalRange] = useState(400);
  const [currentRange, setCurrentRange] = useState(360);

  const safeOriginal = Math.max(1, originalRange);
  const safeCurrent = Math.min(safeOriginal, Math.max(0, currentRange));
  const healthPct = Math.round((safeCurrent / safeOriginal) * 100);
  const degradation = 100 - healthPct;

  const color =
    healthPct >= 90 ? '#10b981' :
    healthPct >= 75 ? '#f59e0b' :
    '#ef4444';

  const data = [{ value: healthPct, fill: color }];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Original range (km)
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={originalRange}
            onChange={(e) => setOriginalRange(parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Current max range (km)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={currentRange}
            onChange={(e) => setCurrentRange(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={210}
              endAngle={-30}
              data={data}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: '#f1f5f9' }}
                dataKey="value"
                angleAxisId={0}
                cornerRadius={8}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color }}>{healthPct}%</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">Battery Health</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">Degradation</p>
          <p className="text-lg font-semibold text-slate-700">{degradation}%</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">Range lost</p>
          <p className="text-lg font-semibold text-slate-700">{(safeOriginal - safeCurrent).toFixed(0)} km</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">Status</p>
          <p className="text-sm font-semibold" style={{ color }}>
            {healthPct >= 90 ? 'Excellent' : healthPct >= 75 ? 'Fair' : 'Poor'}
          </p>
        </div>
      </div>
    </div>
  );
}
