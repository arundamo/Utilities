import { useState } from 'react';
import { Sun } from 'lucide-react';

// Constants
const AVG_PANEL_WATTS = 400;           // Watts per panel (modern)
const AVG_PEAK_SUN_HOURS = 4.5;        // hours/day
const PANEL_EFFICIENCY = 0.80;         // 80% system efficiency

export default function SolarToEV({ imperial }) {
  const [annualDistance, setAnnualDistance] = useState(imperial ? 15000 : 20000);
  const [evConsumption, setEvConsumption] = useState(imperial ? 3.5 : 18); // mi/kWh or kWh/100km
  const [peakSunHours, setPeakSunHours] = useState(4.5);
  const [panelWatts, setPanelWatts] = useState(400);

  const distLabel = imperial ? 'mi' : 'km';
  const evEffLabel = imperial ? 'mi/kWh' : 'kWh/100km';

  // Annual kWh needed
  const annualKwh = imperial
    ? annualDistance / Math.max(0.1, evConsumption)
    : (annualDistance / 100) * evConsumption;

  // kWh per panel per year
  const kwhPerPanelPerYear = (panelWatts / 1000) * peakSunHours * 365 * PANEL_EFFICIENCY;

  // Panels needed
  const panelsNeeded = Math.ceil(annualKwh / Math.max(0.1, kwhPerPanelPerYear));

  // Cost estimates
  const estimatedSystemCostUSD = panelsNeeded * panelWatts * 2.5; // ~$2.50/W installed
  const annualCO2Saved = annualKwh * 0.233; // avg 233g CO2/kWh avoided

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Annual distance ({distLabel})
          </label>
          <input
            type="number"
            min="0"
            step="500"
            value={annualDistance}
            onChange={(e) => setAnnualDistance(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            EV efficiency ({evEffLabel})
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={evConsumption}
            onChange={(e) => setEvConsumption(parseFloat(e.target.value) || 0.1)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Peak sun hours/day
          </label>
          <input
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={peakSunHours}
            onChange={(e) => setPeakSunHours(parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Panel size (W)
          </label>
          <input
            type="number"
            min="100"
            max="700"
            step="10"
            value={panelWatts}
            onChange={(e) => setPanelWatts(parseFloat(e.target.value) || 100)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Visual panel count */}
      <div className="bg-amber-50 rounded-xl p-4 text-center">
        <div className="flex flex-wrap justify-center gap-1.5 mb-3">
          {Array.from({ length: Math.min(panelsNeeded, 24) }).map((_, i) => (
            <div key={i} className="w-7 h-7 bg-amber-400 rounded-md flex items-center justify-center shadow-sm">
              <Sun size={14} className="text-white" />
            </div>
          ))}
          {panelsNeeded > 24 && (
            <div className="w-7 h-7 bg-amber-200 rounded-md flex items-center justify-center text-amber-600 text-xs font-bold">
              +{panelsNeeded - 24}
            </div>
          )}
        </div>
        <p className="text-xs text-amber-700 font-medium mb-1">Solar Panels Required</p>
        <p className="text-4xl font-bold text-amber-600">{panelsNeeded}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">Annual energy</p>
          <p className="text-sm font-semibold text-slate-700">{annualKwh.toFixed(0)} kWh</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">Est. system cost</p>
          <p className="text-sm font-semibold text-slate-700">${(estimatedSystemCostUSD / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">CO₂ saved/yr</p>
          <p className="text-sm font-semibold text-emerald-600">{(annualCO2Saved / 1000).toFixed(2)} t</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        80% system efficiency · ~$2.50/W installed estimate
      </p>
    </div>
  );
}
