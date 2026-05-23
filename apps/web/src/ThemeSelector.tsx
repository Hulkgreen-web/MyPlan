import React, { useEffect, useState } from 'react';

const THEMES = ["light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset"
    ];

export const ThemeSelector: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'nord');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Notifie le reste de l'application
    window.dispatchEvent(new Event('theme-change'));
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs opacity-50 font-bold uppercase tracking-widest">Thème</span>
      <select 
        className="select select-bordered select-sm select-primary focus:outline-none" 
        value={theme} 
        onChange={(e) => setTheme(e.target.value)}
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
