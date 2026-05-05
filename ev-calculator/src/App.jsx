import { useState } from 'react';
import { Settings, Zap, Fuel, Battery, Clock, Snowflake, Sun, X, ChevronRight } from 'lucide-react';
import FuelSavingsCalc from './components/FuelSavingsCalc';
import BatteryHealthTracker from './components/BatteryHealthTracker';
import HomeChargingTimer from './components/HomeChargingTimer';
import WinterRangeEstimator from './components/WinterRangeEstimator';
import SolarToEV from './components/SolarToEV';

const CALCULATORS = [
  {
    id: 'fuel',
    title: 'Fuel Savings',
    subtitle: 'Compare gas vs. EV annual costs',
    icon: Fuel,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    component: FuelSavingsCalc,
    usesImperial: true,
  },
  {
    id: 'battery',
    title: 'Battery Health',
    subtitle: 'Track degradation over time',
    icon: Battery,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    component: BatteryHealthTracker,
    usesImperial: false,
  },
  {
    id: 'charging',
    title: 'Charging Timer',
    subtitle: 'Estimate time to 80% or full',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    component: HomeChargingTimer,
    usesImperial: false,
  },
  {
    id: 'winter',
    title: 'Winter Range',
    subtitle: 'Cold-weather range estimator',
    icon: Snowflake,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    component: WinterRangeEstimator,
    usesImperial: true,
  },
  {
    id: 'solar',
    title: 'Solar to EV',
    subtitle: 'Panels needed for your mileage',
    icon: Sun,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    component: SolarToEV,
    usesImperial: true,
  },
];

function Modal({ calc, imperial, onClose }) {
  const Icon = calc.icon;
  const CalcComponent = calc.component;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${calc.bg} flex items-center justify-center`}>
              <Icon size={18} className={calc.color} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">{calc.title}</h2>
              <p className="text-xs text-slate-400">{calc.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>
        <div className="p-5">
          <CalcComponent imperial={imperial} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [imperial, setImperial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [openCalc, setOpenCalc] = useState(null);

  const activeCalc = CALCULATORS.find((c) => c.id === openCalc);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight">EV Calculator Hub</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Universal EV Tools</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showSettings
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {showSettings && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Unit System</p>
                <p className="text-xs text-slate-400">Switch between metric and imperial</p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => setImperial(false)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    !imperial ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={() => setImperial(true)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    imperial ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <Zap size={11} />
          5 Calculators · {imperial ? 'Imperial' : 'Metric'} Units
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
          Your EV, Optimized
        </h2>
        <p className="text-slate-500 text-base max-w-lg mx-auto">
          Professional tools to plan, compare, and maximize your electric vehicle experience.
        </p>
      </section>

      {/* Calculator Grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon;
            return (
              <button
                key={calc.id}
                onClick={() => setOpenCalc(calc.id)}
                className={`group bg-white rounded-2xl border ${calc.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 text-left w-full`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${calc.bg} flex items-center justify-center`}>
                    <Icon size={20} className={calc.color} />
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mt-1"
                  />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">{calc.title}</h3>
                <p className="text-sm text-slate-400">{calc.subtitle}</p>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">EV Calculator Hub</span>
          </div>
          <p className="text-xs text-slate-400">
            All calculations are estimates. Results may vary based on vehicle and conditions.
          </p>
        </div>
      </footer>

      {/* Modal */}
      {activeCalc && (
        <Modal
          calc={activeCalc}
          imperial={imperial}
          onClose={() => setOpenCalc(null)}
        />
      )}
    </div>
  );
}

