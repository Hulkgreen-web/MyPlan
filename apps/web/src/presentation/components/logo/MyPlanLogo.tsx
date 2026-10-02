import React from 'react';

export const MyPlanLogo = ({ className = "h-8 w-auto" }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 140 40"
            // On s'assure qu'il hérite de la couleur du texte courant (ex: text-base-content)
            className={`text-base-content ${className}`}
        >
            <g transform="translate(0, 0)">
                {/* Barres standards (prennent la couleur du texte du thème) */}
                <rect x="4" y="20" width="8" height="16" rx="2" fill="currentColor" />
                <rect x="16" y="12" width="8" height="24" rx="2" fill="currentColor" />
                
                {/* Dernière barre : utilise la couleur "Primary" du thème actif */}
                <rect x="28" y="4" width="8" height="32" rx="2" className="fill-primary" />
                
                {/* Ligne de tendance et flèche : utilise la couleur "Secondary" du thème actif pour plus de visibilité */}
                <path 
                    d="M 2 26 L 14 18 L 22 24 L 36 8" 
                    fill="none" 
                    className="stroke-secondary"
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
                <polygon points="38,4 30,6 36,12" className="fill-secondary" />
            </g>

            {/* Texte du logo */}
            <text 
                x="46" 
                y="29" 
                fontFamily="Inter, system-ui, -apple-system, sans-serif" 
                fontSize="24" 
                fontWeight="800" 
                letterSpacing="-0.5px"
            >
                {/* "My" prend la couleur du texte */}
                <tspan fill="currentColor">My</tspan>
                {/* "Plan" prend la couleur "Primary" du thème */}
                <tspan className="fill-primary">Plan</tspan>
            </text>
        </svg>
    );
};

export default MyPlanLogo;