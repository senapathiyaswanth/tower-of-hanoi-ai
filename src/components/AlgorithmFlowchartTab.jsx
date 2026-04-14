import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export function AlgorithmFlowchartTab({ numDisks = 3, rods = [[],[],[]] }) {
  const [svgStr, setSvgStr] = useState('');

  // Generate dynamic blueprint states
  const blueprintSteps = React.useMemo(() => {
    if (numDisks > 8) return []; // Safety limit
    const steps = [];
    const state = {
      A: Array.from({length: numDisks}, (_, i) => i + 1), // e.g. [1, 2, 3] where 1 is bottom, 3 is top...
      B: [],
      C: []
    };
    // Let's format state like [3, 2, 1] where 3 is largest at bottom.
    // So Array.from({length: numDisks}, (_, i) => numDisks - i) gives [3, 2, 1] which is correct.
    state.A = Array.from({length: numDisks}, (_, i) => numDisks - i);

    const cloneState = () => ({ A: [...state.A], B: [...state.B], C: [...state.C] });

    steps.push({
      num: 'S',
      action: `Initial State \u2013 All ${numDisks} disks on Rod A`,
      state: cloneState(),
      isGoal: false
    });

    let moveCount = 1;
    const totalMoves = Math.pow(2, numDisks) - 1;

    const solve = (disks, src, aux, tgt) => {
      if (disks === 0) return;
      solve(disks - 1, src, tgt, aux);
      
      const disk = state[src].pop();
      state[tgt].push(disk);

      const isGoal = moveCount === totalMoves;
      steps.push({
        num: moveCount,
        action: isGoal ? `Move Disk ${disk} from ${src} \u2192 ${tgt} - GOAL REACHED!` : `Move Disk ${disk} from ${src} \u2192 ${tgt}`,
        state: cloneState(),
        isGoal
      });
      moveCount++;

      solve(disks - 1, aux, src, tgt);
    };

    solve(numDisks, 'A', 'B', 'C');
    return steps;
  }, [numDisks]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#1e293b',
        primaryBorderColor: '#3b82f6',
        primaryTextColor: '#f8fafc',
        lineColor: '#94a3b8',
        secondaryColor: '#f59e0b',
        tertiaryColor: '#10b981',
        fontFamily: '"Outfit", system-ui, sans-serif'
      },
      flowchart: { curve: 'basis' }
    });

    const graphDefinition = `
      flowchart TD
        Start([Start Simulation])
        Input[/Input: Set N Disks/]
        Compute[Generate Recursive Move Sequence]
        Decision{Pending\\nMoves?}
        UpdateUI[/Pop & Push Disks, Log Output/]
        DelayTimeout[Await Interval Time]
        Finish([Simulation Ends])

        Start --> Input
        Input --> Compute
        Compute --> Decision
        Decision -- Yes --> UpdateUI
        UpdateUI --> DelayTimeout
        DelayTimeout --> Decision
        Decision -- No --> Finish
    `;
    
    const uid = 'mermaid-' + Math.random().toString(36).substring(2, 10);
    
    mermaid.render(uid, graphDefinition)
      .then((res) => {
         setSvgStr(res.svg);
      })
      .catch(e => {
         console.error("Mermaid Render Error:", e);
         setSvgStr('<div style="color:red; text-align:center;">Failed to compile flowchart schematic.</div>');
      });
  }, []);

  return (
    <div className="tab-content fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="top-card" style={{ marginBottom: '1.5rem' }}>
        <h2>Algorithm & Process Flow</h2>
        <p>A rigorous linear flowchart and recursive breakdown representing the algorithmic core.</p>
      </div>

      <div className="layout-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)'}}>
         
        {/* Left column: Recursive Logic */}
        <section className="panel center-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>The Core Algorithm Structure</h3>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6'}}>
              The puzzle is gracefully solved using a recursive algorithm. Moving <code>n</code> disks from <strong>Source</strong> to <strong>Target</strong> requires breaking the problem into three fundamental, repeating sub-steps:
            </p>
            <ol style={{paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)'}}>
              <li>Move <code>n-1</code> disks entirely from the Source rod to the Auxiliary rod.</li>
              <li>Move the single largest <code>nth</code> disk directly from the Source rod to the Target rod.</li>
              <li>Move the <code>n-1</code> disks from the Auxiliary rod onto the Target rod.</li>
            </ol>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6'}}>
              By continually reducing <code>n</code> recursively until reaching the trivial base case (moving just 1 disk), the system systematically shifts obstructing disks to the auxiliary tower, frees the path for the massive disks at the base, and securely builds up the target stack without ever placing a larger disk on a smaller one.
            </p>
            <div className="terminal" style={{ minHeight: 'auto', flex: 'none', marginBottom: '1.5rem' }}>
               <div className="terminal-body" style={{padding: '1rem'}}>
<pre style={{margin: 0, fontFamily: 'var(--mono)', fontSize: '0.95rem', color: '#e2e8f0'}}>
{`function solve(n, src, aux, tgt) {
  if (n === 1) {
    moveDisk(src, tgt);
    return;
  }
  solve(n - 1, src, tgt, aux);
  moveDisk(src, tgt);
  solve(n - 1, aux, src, tgt);
}`}
</pre>
               </div>
            </div>

            <h3>Live Memory State</h3>
            <div className="state-card" style={{ background: 'var(--highlight-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
              <div className="state-row"><span>A</span><code>[{rods[0].map(d=>d.id).join(', ')}]</code></div>
              <div className="state-row"><span>B</span><code>[{rods[1].map(d=>d.id).join(', ')}]</code></div>
              <div className="state-row"><span>C</span><code>[{rods[2].map(d=>d.id).join(', ')}]</code></div>
            </div>
        </section>

        {/* Right column: Flowchart */}
        <section className="panel center-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>Process Architecture Flowchart</h3>
            <p style={{color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6'}}>
              Visual mapping of the React lifecycle bridging the solved sequence into staggered layout updates.
            </p>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--panel-border)', minHeight: '300px' }}>
                 {svgStr ? (
                     <div 
                       className="mermaid-container" 
                       dangerouslySetInnerHTML={{ __html: svgStr }}
                       style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                     />
                 ) : (
                     <div style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>Loading Architectural Schematic...</div>
                 )}
            </div>
        </section>
      </div>

      <div className="blueprint-container">
         <div className="blueprint-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--electric-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            <h2>OPTIMAL SOLUTION BLUEPRINT</h2>
         </div>
         <div className="blueprint-subtitle">PUZZLE: {numDisks} DISKS · ROD A → TARGET C · {Math.pow(2, numDisks) - 1} STEPS</div>

         {blueprintSteps.map((step, idx) => (
           <div key={idx} className={`blueprint-row ${step.isGoal ? 'goal' : ''}`}>
              <div className="blueprint-num">{step.num}</div>
              <div className="blueprint-text">
                 <h4>{step.action}</h4>
                 <p>ROD A: [{step.state.A.join(', ')}] | ROD B: [{step.state.B.join(', ')}] | ROD C: [{step.state.C.join(', ')}]</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
