import { useState } from 'react';
import { Snowflake, Thermometer } from 'lucide-react';

// Average EV range efficiency loss by temperature (Celsius)
// Based on AAA and real-world data. At 21°C = 100% (baseline).
function efficiencyFactor(tempC) {
  if (tempC >= 21) return 1 - Math.min(0.05, (tempC - 21) * 0.002); // slight heat loss
  if (tempC >= 10) return 1 - (21 - tempC) * 0.005;  // mild loss
  if (tempC >= 0)  return 1 - 0.055 - (10 - tempC) * 0.012;
  if (tempC >= -10) return 1 - 0.175 - (-tempC) * 0.015;
  return Math.max(0.5, 1 - 0.325 - (-tempC - 10) * 0.01);
}

function tempLabel(tempC, imperial) {
  if (imperial) return `${Math.round(tempC * 9 / 5 + 32)}°F`;
  return `${tempC}°C`;
}

export default function WinterRangeEstimator({ imperial }) {
  const [nominalRange, setNominalRange] = useState(imperial ? 250 : 400);
  const [tempC, setTempC] = useState(0);

  const factor = efficiencyFactor(tempC);
  const estimatedRange = nominalRange * factor;
  const lossPercent = Math.round((1 - factor) * 100);
  const distLabel = imperial ? 'mi' : 'km';

  const tempMin = -30;
  const tempMax = 40;

  const barColor =
    tempC >= 15 ? '#10b981' :
    tempC >= 0  ? '#f59e0b' :
    '#3b82f6';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">
          Nominal rated range ({distLabel})
        </label>
        <input
          type="number"
          min="1"
          step="5"
          value={nominalRange}
          onChange={(e) => setNominalRange(parseFloat(e.target.value) || 1)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
            {tempC <= 0 ? <Snowflake size={13} className="text-blue-400" /> : <Thermometer size={13} className="text-orange-400" />}
            Temperature
          </label>
          <span className="text-sm font-semibold text-slate-700">
            {tempLabel(tempC, imperial)}
          </span>
        </div>
        <input
          type="range"
          min={tempMin}
          max={tempMax}
          value={tempC}
          onChange={(e) => setTempC(parseInt(e.target.value))}
          className="w-full h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{tempLabel(tempMin, imperial)}</span>
          <span>21°C (ideal)</span>
          <span>{tempLabel(tempMax, imperial)}</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-400">Estimated range</p>
            <p className="text-3xl font-bold text-slate-800">
              {estimatedRange.toFixed(0)}
              <span className="text-lg font-medium text-slate-400 ml-1">{distLabel}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Efficiency</p>
            <p className="text-xl font-bold" style={{ color: barColor }}>
              {Math.round(factor * 100)}%
            </p>
          </div>
        </div>

        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.round(factor * 100)}%`, backgroundColor: barColor }}
          />
        </div>

        <p className="text-xs text-center text-slate-500">
          {lossPercent > 0
            ? `Range reduced by ${lossPercent}% due to temperature`
            : 'Optimal temperature — full range available'}
        </p>
      </div>
    </div>
  );
}
