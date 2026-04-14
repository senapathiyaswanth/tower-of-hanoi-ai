import React from 'react';
import { COLORS } from '../hooks/useHanoi';

export function Board({ rods, numDisks, transitionSpeed }) {
  const ROD_POSITIONS = [16.66, 50, 83.33];
  const tSpeed = (transitionSpeed * 0.8) / 1000;
  
  const disksArray = Array.from({ length: numDisks }, (_, i) => numDisks - i); 
  
  return (
    <div className="game-board">
      {[0, 1, 2].map((rodIndex) => (
        <div key={`rod-${rodIndex}`} className="rod" style={{ left: `${ROD_POSITIONS[rodIndex]}%` }}>
          <div className="rod-label">{['A', 'B', 'C'][rodIndex]}</div>
        </div>
      ))}
      
      {disksArray.map(diskId => {
         let rodIdx = 0;
         let diskPosIdx = 0;
         for (let r = 0; r < 3; r++) {
            const idx = rods[r].findIndex(d => d.id === diskId);
            if (idx !== -1) {
               rodIdx = r;
               diskPosIdx = idx;
               break;
            }
         }
         
         const minW = 10;
         const maxW = 32;
         const diskWidth = numDisks === 1 ? maxW : minW + (diskId - 1) * ((maxW - minW) / (numDisks - 1));
         
         const color = COLORS[diskId - 1] || '#ccc';

         return (
            <div 
              key={`disk-${diskId}`} 
              className="disk"
              style={{
                left: `${ROD_POSITIONS[rodIdx]}%`,
                bottom: `${diskPosIdx * 26}px`,
                width: `${diskWidth}%`,
                backgroundColor: color,
                transition: `left ${tSpeed}s ease-in-out, bottom ${tSpeed}s ease-in-out`
              }}
            />
         );
      })}
    </div>
  );
}
