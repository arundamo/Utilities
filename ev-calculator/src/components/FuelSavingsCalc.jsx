import { useState } from 'react';
import { Fuel } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm text-sm">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-emerald-600">${payload[0].value.toFixed(2)} / year</p>
      </div>
    );
  }
  return null;
};

export default function FuelSavingsCalc({ imperial }) {
  const [gasConsumption, setGasConsumption] = useState(imperial ? 28 : 9);   // mpg or L/100km
  const [evConsumption, setEvConsumption] = useState(imperial ? 3.5 : 18);   // mi/kWh or kWh/100km
  const [annualDistance, setAnnualDistance] = useState(imperial ? 15000 : 20000); // mi or km
  const [fuelPrice, setFuelPrice] = useState(imperial ? 3.5 : 1.65);         // $/gal or $/L
  const [electricityPrice, setElectricityPrice] = useState(0.14);             // $/kWh

  // Compute annual cost for gas
  const gasCostPerYear = imperial
    ? (annualDistance / gasConsumption) * fuelPrice
    : (annualDistance / 100) * gasConsumption * fuelPrice;

  // Compute annual cost for EV
  const evCostPerYear = imperial
    ? (annualDistance / evConsumption) * electricityPrice
    : (annualDistance / 100) * evConsumption * electricityPrice;

  const annualSavings = gasCostPerYear - evCostPerYear;
  const distLabel = imperial ? 'mi' : 'km';
  const fuelLabel = imperial ? 'mpg' : 'L/100km';
  const evEffLabel = imperial ? 'mi/kWh' : 'kWh/100km';
  const fuelPriceLabel = imperial ? '$/gal' : '$/L';

  const data = [
    { name: 'Gas Car', cost: gasCostPerYear },
    { name: 'EV', cost: evCostPerYear },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Gas consumption ({fuelLabel})
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={gasConsumption}
            onChange={(e) => setGasConsumption(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            EV efficiency ({evEffLabel})
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={evConsumption}
            onChange={(e) => setEvConsumption(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Annual distance ({distLabel})
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={annualDistance}
            onChange={(e) => setAnnualDistance(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Fuel price ({fuelPriceLabel})
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Electricity price ($/kWh)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={electricityPrice}
            onChange={(e) => setElectricityPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100,116,139,0.07)' }} />
          <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
            <Cell fill="#f97316" />
            <Cell fill="#10b981" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className={`rounded-xl p-4 text-center ${annualSavings >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
        <p className="text-xs font-medium text-slate-500 mb-1">Annual savings with EV</p>
        <p className={`text-3xl font-bold ${annualSavings >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {annualSavings >= 0 ? '+' : ''}${annualSavings.toFixed(0)}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Gas: ${gasCostPerYear.toFixed(0)}/yr &nbsp;·&nbsp; EV: ${evCostPerYear.toFixed(0)}/yr
        </p>
      </div>
    </div>
  );
}
