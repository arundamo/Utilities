import { useState } from 'react';
import { Zap } from 'lucide-react';

function formatTime(hours) {
  if (!isFinite(hours) || hours < 0) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function HomeChargingTimer() {
  const [batterySize, setBatterySize] = useState(75);    // kWh
  const [currentPct, setCurrentPct] = useState(20);     // %
  const [chargerSpeed, setChargerSpeed] = useState(7.4); // kW

  const safeSpeed = Math.max(0.1, chargerSpeed);
  const currentKwh = (batterySize * currentPct) / 100;
  const target80Kwh = batterySize * 0.8;
  const target100Kwh = batterySize;

  const timeTo80 = currentPct >= 80 ? 0 : (target80Kwh - currentKwh) / safeSpeed;
  const timeTo100 = (target100Kwh - currentKwh) / safeSpeed;

  const progressFill80 = Math.min(100, Math.max(0, ((currentPct) / 80) * 100));
  const progressFill100 = Math.min(100, currentPct);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Battery size (kWh)
          </label>
          <input
            type="number"
            min="1"
            step="0.5"
            value={batterySize}
            onChange={(e) => setBatterySize(parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Current charge: {currentPct}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentPct}
            onChange={(e) => setCurrentPct(parseInt(e.target.value))}
            className="w-full h-2 rounded-full cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Charger speed (kW)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={chargerSpeed}
            onChange={(e) => setChargerSpeed(parseFloat(e.target.value) || 0.1)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        {/* To 80% */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-500" />
              <span className="text-sm font-medium text-slate-600">Charge to 80%</span>
            </div>
            <span className="text-lg font-bold text-amber-500">
              {currentPct >= 80 ? 'Done ✓' : formatTime(timeTo80)}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${progressFill80}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{currentPct}%</span>
            <span>80%</span>
          </div>
        </div>

        {/* To 100% */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-emerald-500" />
              <span className="text-sm font-medium text-slate-600">Full charge (100%)</span>
            </div>
            <span className="text-lg font-bold text-emerald-600">
              {currentPct >= 100 ? 'Done ✓' : formatTime(timeTo100)}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressFill100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{currentPct}%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Current: {currentKwh.toFixed(1)} kWh · Capacity: {batterySize} kWh
      </p>
    </div>
  );
}
