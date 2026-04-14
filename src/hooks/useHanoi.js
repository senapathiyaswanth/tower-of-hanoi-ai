import { useState, useCallback, useEffect, useRef } from 'react';

// Cyberpunk Neon Gradient (Cyan -> Blue -> Purple -> Magenta)
export const COLORS = [
  '#00D4FF', '#00A3FF', '#2A66FF', '#5C4DFF', 
  '#8033FF', '#A31AFF', '#C900FF', '#E500E5'
];
export const ROD_NAMES = ['A', 'B', 'C'];

const getAudioContext = (() => {
  let audioCtx = null;
  return () => {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return audioCtx;
  };
})();

const playBeep = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(600, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.06);
};

export function useHanoi() {
  const [numDisks, setNumDisksState] = useState(3);
  const numDisksRef = useRef(3);
  const setNumDisks = useCallback((d) => { setNumDisksState(d); numDisksRef.current = d; }, []);

  const initialRods = (() => {
    const initialRodA = [];
    for (let i = 3; i > 0; i--) {
      initialRodA.push({ id: i, color: COLORS[i - 1] || '#ccc' });
    }
    return [initialRodA, [], []];
  })();

  const [rods, setRodsState] = useState(initialRods);
  const rodsRef = useRef(initialRods);
  const setRods = useCallback((r) => { setRodsState(r); rodsRef.current = r; }, []);

  const [moves, setMovesState] = useState([]);
  const movesRef = useRef([]);
  const setMoves = useCallback((m) => { setMovesState(m); movesRef.current = m; }, []);

  const [moveIndex, setMoveIndexState] = useState(0);
  const moveIndexRef = useRef(0);
  const setMoveIndex = useCallback((i) => { setMoveIndexState(i); moveIndexRef.current = i; }, []);

  const [isSolving, setIsSolvingState] = useState(false);
  const isSolvingRef = useRef(false);
  const setIsSolving = useCallback((b) => { setIsSolvingState(b); isSolvingRef.current = b; }, []);

  const [isPaused, setIsPausedState] = useState(false);
  const isPausedRef = useRef(false);
  const setIsPaused = useCallback((b) => { setIsPausedState(b); isPausedRef.current = b; }, []);

  const [speed, setSpeed] = useState(500);
  const [logs, setLogs] = useState([]);

  const initGame = useCallback((disks) => {
    const d = Math.max(2, Math.min(8, disks));
    setNumDisks(d);
    
    const initialRodA = [];
    for (let i = d; i > 0; i--) {
      initialRodA.push({ id: i, color: COLORS[i - 1] || '#ccc' });
    }
    
    setRods([initialRodA, [], []]);
    setMoves([]);
    setMoveIndex(0);
    setIsSolving(false);
    setIsPaused(false);
    setLogs([]);
  }, [setNumDisks, setRods, setMoves, setMoveIndex, setIsSolving, setIsPaused]);

  const prepareMoves = useCallback(() => {
    const computedMoves = [];
    const solve = (n, src, aux, tgt) => {
      if (n === 1) {
        computedMoves.push({ from: src, to: tgt });
        return;
      }
      solve(n - 1, src, tgt, aux);
      computedMoves.push({ from: src, to: tgt });
      solve(n - 1, aux, src, tgt);
    };
    solve(numDisksRef.current, 0, 1, 2);
    setMoves(computedMoves);
  }, [setMoves]);

  const executeOneMove = useCallback(() => {
    const cIdx = moveIndexRef.current;
    const cMoves = movesRef.current;
    
    if (cIdx >= cMoves.length) {
      setIsSolving(false);
      setIsPaused(false);
      return;
    }
    
    const move = cMoves[cIdx];
    const newRods = rodsRef.current.map(r => [...r]);
    const movingDisk = newRods[move.from].pop();
    
    if (movingDisk) {
       newRods[move.to].push(movingDisk);
       setRods(newRods);
       
       setLogs(l => {
          const newLogs = [...l, { step: cIdx + 1, text: `${ROD_NAMES[move.from]} → ${ROD_NAMES[move.to]} (disk ${movingDisk.id})` }];
          if (newLogs.length > 200) newLogs.shift();
          return newLogs;
       });
       playBeep();
    }

    setMoveIndex(cIdx + 1);
    
    if (cIdx + 1 >= cMoves.length) {
       setIsSolving(false);
       setIsPaused(false);
    }
  }, [setMoveIndex, setRods, setIsSolving, setIsPaused]);

  useEffect(() => {
     let timer = null;
     if (isSolving && !isPaused) {
        timer = setInterval(() => {
           executeOneMove();
        }, speed);
     }
     return () => clearInterval(timer);
  }, [isSolving, isPaused, speed, executeOneMove]);

  const start = () => {
    if (moveIndexRef.current === 0 && movesRef.current.length === 0) prepareMoves();
    setIsSolving(true);
    setIsPaused(false);
  };
  
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  
  const step = () => {
    if (moveIndexRef.current === 0 && movesRef.current.length === 0) prepareMoves();
    setIsSolving(true);
    setIsPaused(true);
    executeOneMove();
  };

  const reset = () => {
    initGame(numDisksRef.current);
  };

  return {
    numDisks, setNumDisks: initGame,
    rods, moves, moveIndex,
    isSolving, isPaused, speed, setSpeed,
    logs, start, pause, resume, step, reset,
    totalMoves: Math.pow(2, numDisks) - 1,
    upNext: (moveIndex < moves.length && moves.length > 0) ? `${ROD_NAMES[moves[moveIndex].from]} → ${ROD_NAMES[moves[moveIndex].to]}` : '—'
  };
}
