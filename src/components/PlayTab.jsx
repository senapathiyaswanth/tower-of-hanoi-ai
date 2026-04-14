import React, { useState, useCallback } from 'react';
import { COLORS } from '../hooks/useHanoi';

export function PlayTab() {
  const [numDisks, setNumDisks] = useState(3);

  const initialRods = (() => {
    const initialRodA = [];
    for (let i = 3; i > 0; i--) {
      initialRodA.push({ id: i });
    }
    return [initialRodA, [], []];
  })();

  const [rods, setRods] = useState(initialRods);
  const [history, setHistory] = useState([]);
  const [moves, setMoves] = useState(0);
  const [selectedRod, setSelectedRod] = useState(null);
  const [win, setWin] = useState(false);
  const [message, setMessage] = useState('');

  const initGame = useCallback((disks) => {
    const d = Math.max(2, Math.min(8, disks));
    const initialRodA = [];
    for (let i = d; i > 0; i--) {
      initialRodA.push({ id: i });
    }
    setRods([initialRodA, [], []]);
    setHistory([]);
    setMoves(0);
    setSelectedRod(null);
    setWin(false);
    setMessage('');
  }, []);


  const targetMoves = Math.pow(2, numDisks) - 1;

  const handleHint = () => {
    if (win) return;
    const pos = new Array(numDisks + 1);
    for (let r = 0; r < 3; r++) {
      for (let d of rods[r]) {
        pos[d.id] = r;
      }
    }

    const solveNextMove = (disk, tgtRod) => {
      if (disk === 0) return null;
      const curRod = pos[disk];
      if (curRod === tgtRod) return solveNextMove(disk - 1, tgtRod);
      const auxRod = 3 - curRod - tgtRod;
      let blocked = false;
      for (let d = disk - 1; d >= 1; d--) {
        if (pos[d] !== auxRod) { blocked = true; break; }
      }
      return blocked ? solveNextMove(disk - 1, auxRod) : { disk, from: curRod, to: tgtRod };
    };

    const nextPlay = solveNextMove(numDisks, 2);
    if (!nextPlay) setMessage("You have already solved the puzzle!");
    else {
      const names = ['A', 'B', 'C'];
      setMessage(`Hint: Move Disk ${nextPlay.disk} from Rod ${names[nextPlay.from]} to Rod ${names[nextPlay.to]}`);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || win) return;
    const lastState = history[history.length - 1];
    setRods(lastState.rods);
    setMoves(lastState.moves);
    setHistory(history.slice(0, -1));
    setMessage('Move undone.');
    setSelectedRod(null);
  };

  const handleColumnClick = (rIndex) => {
    if (win) return;
    setMessage('');

    if (selectedRod === null) {
      if (rods[rIndex].length === 0) return;
      setSelectedRod(rIndex);
    } else {
      if (selectedRod === rIndex) {
        setSelectedRod(null);
        return;
      }
      const sourceRod = rods[selectedRod];
      const targetRod = rods[rIndex];
      const disk = sourceRod[sourceRod.length - 1];
      const targetTop = targetRod[targetRod.length - 1];

      if (targetTop && targetTop.id < disk.id) {
        setMessage("Invalid Move! A larger disk cannot be placed on a smaller one.");
        setSelectedRod(null);
        return;
      }

      const newRods = [[...rods[0]], [...rods[1]], [...rods[2]]];
      const movedDisk = newRods[selectedRod].pop();
      newRods[rIndex].push(movedDisk);
      
      setHistory([...history, { rods: [[...rods[0]], [...rods[1]], [...rods[2]]], moves }]);
      setRods(newRods);
      setMoves(moves + 1);
      setSelectedRod(null);

      if (newRods[2].length === numDisks) {
        setWin(true);
      }
    }
  };

  const ROD_POSITIONS = [16.66, 50, 83.33];
  const disksArray = Array.from({ length: numDisks }, (_, i) => numDisks - i);

  return (
    <div className="tab-content fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="top-card">
        <h2>Interactive Hanoi</h2>
        <p>Test your algorithmic thinking manually. Solve the puzzle in the minimal number of optimal moves.</p>
      </div>

      <div className="panel center-panel mt-4" style={{ flex: 1, paddingBottom: '3rem' }}>
        <div className="controls-row">
            <div className="input-group">
                <label>Disks:</label>
                <input 
                    type="number" 
                    min="2" 
                    max="8" 
                    value={numDisks} 
                    onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                            setNumDisks(val);
                            initGame(Math.max(2, Math.min(8, val)));
                        }
                    }} 
                />
            </div>
            <div className="btn-group" style={{ marginBottom: 0 }}>
                <button className="btn outline" onClick={() => initGame(numDisks)}>Restart</button>
                <button className="btn outline" style={{color:'var(--warning)', borderColor:'rgba(245, 158, 11, 0.3)'}} onClick={handleUndo} disabled={history.length === 0 || win}>Undo</button>
                <button className="btn outline primary" onClick={handleHint} disabled={win}>Hint</button>
            </div>
        </div>

        <div className="stats-row mt-4" style={{display:'flex', justifyContent:'space-around', background: 'rgba(0,0,0,0.2)', padding:'1rem', borderRadius:'12px', border: '1px solid var(--panel-border)', marginBottom: '2rem'}}>
            <div style={{textAlign:'center'}}>
                <span style={{color:'var(--muted-text)', fontSize:'0.9rem', fontWeight: 600}}>Current Moves</span>
                <div style={{fontSize:'2.2rem', fontWeight:800, color: (moves > targetMoves && !win) ? 'var(--warning)' : 'var(--text-color)'}}>{moves}</div>
            </div>
            <div style={{textAlign:'center'}}>
                <span style={{color:'var(--muted-text)', fontSize:'0.9rem', fontWeight: 600}}>Target (Optimal)</span>
                <div style={{fontSize:'2.2rem', fontWeight:800, color: 'var(--primary)'}}>{targetMoves}</div>
            </div>
        </div>

        <div style={{minHeight: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem'}}>
          {message && <div style={{color:'var(--danger)', fontWeight:800}}>{message}</div>}
          {win && <div style={{color:'var(--success)', fontSize:'1.4rem', fontWeight:800}}>✨ Brilliant! Puzzle Completed! ✨</div>}
        </div>

        <div className="game-board" style={{ height: 'clamp(300px, 45vh, 400px)' }}>
            {[0, 1, 2].map((rodIndex) => (
               <div 
                  key={`zone-${rodIndex}`} 
                  className={`click-zone ${selectedRod === rodIndex ? 'selected' : ''}`}
                  onClick={() => handleColumnClick(rodIndex)}
                  style={{
                      position: 'absolute',
                      left: `${rodIndex * 33.33}%`,
                      width: '33.33%',
                      height: '100%',
                      cursor: 'pointer',
                      zIndex: 10,
                      backgroundColor: selectedRod === rodIndex ? 'rgba(255,255,255,0.06)' : 'transparent',
                      borderRight: rodIndex < 2 ? '1px dashed rgba(255,255,255,0.1)' : 'none',
                      transition: 'background-color 0.2s'
                  }}
               />
            ))}

            {[0, 1, 2].map((rodIndex) => (
                <div key={`rod-${rodIndex}`} className="rod" style={{ left: `${ROD_POSITIONS[rodIndex]}%`, height: 'clamp(240px, 35vh, 320px)' }}>
                   <div className="rod-label" style={{color: selectedRod === rodIndex ? 'var(--primary)' : 'inherit'}}>{['A', 'B', 'C'][rodIndex]}</div>
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

               const isTopAndSelected = selectedRod === rodIdx && diskPosIdx === rods[rodIdx].length - 1;

               return (
                  <div 
                    key={`disk-${diskId}`} 
                    className={`disk ${isTopAndSelected ? 'disk-selected' : ''}`}
                    style={{
                      left: `${ROD_POSITIONS[rodIdx]}%`,
                      bottom: isTopAndSelected ? `${diskPosIdx * 26 + 40}px` : `${diskPosIdx * 26}px`,
                      width: `${diskWidth}%`,
                      backgroundColor: color,
                      transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), bottom 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      zIndex: isTopAndSelected ? 5 : 2
                    }}
                  />
               );
            })}
        </div>
      </div>
    </div>
  );
}
