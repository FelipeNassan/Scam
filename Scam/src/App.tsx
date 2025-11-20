import { useState } from 'react';
import { motion } from 'framer-motion';
import SimuladorAntiGolpes from './features/SimuladorAntiGolpes';

const themes: Record<string, { name: string; gradient: string }> = {
  default: { name: 'Padrão', gradient: 'from-purple-100 to-blue-100' },
  dark: { name: 'Escuro', gradient: 'from-gray-800 to-black' },
  warm: { name: 'Quente', gradient: 'from-yellow-300 to-orange-400' },
  cool: { name: 'Frio', gradient: 'from-cyan-200 to-blue-400' },
  pastel: { name: 'Pastel', gradient: 'from-pink-200 to-indigo-200' },
  sunset: { name: 'Pôr do Sol', gradient: 'from-red-300 to-yellow-200' },
  nature: { name: 'Natureza', gradient: 'from-green-200 to-lime-300' },
  'night-sky': { name: 'Céu Noturno', gradient: 'from-indigo-900 to-blue-900' },
  ocean: { name: 'Oceano', gradient: 'from-blue-300 to-teal-500' },
  forest: { name: 'Floresta', gradient: 'from-green-800 to-emerald-500' },
  candy: { name: 'Doce', gradient: 'from-pink-300 to-rose-200' },
  lava: { name: 'Lava', gradient: 'from-red-600 to-yellow-500' },
  aurora: { name: 'Aurora', gradient: 'from-green-300 to-purple-400' },
  desert: { name: 'Deserto', gradient: 'from-yellow-100 to-amber-300' },
  midnight: { name: 'Meia-Noite', gradient: 'from-gray-900 to-indigo-800' },
  galaxy: { name: 'Galáxia', gradient: 'from-fuchsia-600 to-indigo-600' },
  ice: { name: 'Gelo', gradient: 'from-blue-100 to-slate-200' },
  sakura: { name: 'Sakura', gradient: 'from-rose-100 to-pink-300' },
  cyberpunk: { name: 'Cyberpunk', gradient: 'from-pink-500 to-yellow-300' },
};

function getRandomThemeKey() {
  const keys = Object.keys(themes);
  const index = Math.floor(Math.random() * keys.length);
  return keys[index];
}

function App() {
  const [theme, setTheme] = useState(getRandomThemeKey());
  const [currentStep, setCurrentStep] = useState<string>('welcome');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[theme].gradient} flex items-center justify-center p-4 relative transition-colors duration-500`}>
      {currentStep === 'welcome' && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-80 shadow-md rounded px-3 py-2 z-10">
          <label className="text-sm font-semibold text-gray-800 mb-1 block">Temas de fundo:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full text-sm px-2 py-1 bg-white border border-gray-300 rounded focus:outline-none"
          >
            {Object.entries(themes).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      <SimuladorAntiGolpes onStepChange={setCurrentStep} />
    </div>
  );
}

export default App;
