import React from 'react';

export function ConceptHub() {
  return (
    <div className="tab-content fade-in page-concept">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px 24px 40px' }}>
        <div className="concept-hero">
          <h2>What is the Tower of Hanoi?</h2>
          <p>
            In Artificial Intelligence and algorithm design, the <strong style={{ color: 'var(--primary)' }}>Tower of Hanoi</strong> is a classic mathematical puzzle that elegantly demonstrates 
            recursive problem solving and exponential time complexity. The objective is to move a stack of disks from the source rod to the target rod following strict rules.
          </p>
        </div>
        
        <div className="concept-cards">
          <div className="concept-card">
             <div className="icon">🔍</div>
             <h3>State-Space Search</h3>
             <p>Each configuration of disks on the rods represents a unique STATE. Solving the puzzle programmatically involves navigating a graph of all reachable states from the initial state to the goal state.</p>
          </div>
          <div className="concept-card">
             <div className="icon">📐</div>
             <h3>Recursive Logic</h3>
             <p>The problem is solved recursively by reducing it to a simpler form: move n-1 disks to an auxiliary rod, move the largest disk to the target, then move n-1 disks to the target.</p>
          </div>
          <div className="concept-card">
             <div className="icon">⏱</div>
             <h3>2ⁿ Complexity</h3>
             <p>The number of minimal moves required to perfectly solve the puzzle is exactly 2ⁿ - 1. This exponential growth makes it a standard benchmark for algorithmic efficiency.</p>
          </div>
          <div className="concept-card">
             <div className="icon">📜</div>
             <h3>The Core Rules</h3>
             <p>1. Only one disk can be moved at a time.<br/>2. A disk can only be taken from the top of a stack.<br/>3. No disk may be placed on top of a smaller disk.</p>
          </div>
        </div>

        <div className="concept-variants">
          <h3>⚡ PUZZLE DIFFICULTY MATRICES</h3>
          <div style={{overflowX: 'auto'}}>
            <table className="variant-table">
              <thead>
                <tr><th>DISKS COUNT</th><th>EQUATION</th><th>MINIMAL MOVES</th><th>STATUS</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: 'var(--primary)' }}>3 Disks (Basic)</td>
                  <td>(2³) - 1</td>
                  <td style={{ color: 'var(--success)' }}>7 steps</td>
                  <td>Trivially solvable manually</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--primary)' }}>5 Disks (Standard)</td>
                  <td>(2⁵) - 1</td>
                  <td style={{ color: 'var(--success)' }}>31 steps</td>
                  <td>Requires focus</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--primary)' }}>8 Disks (Advanced)</td>
                  <td>(2⁸) - 1</td>
                  <td style={{ color: 'var(--warning)' }}>255 steps</td>
                  <td>Long sequence to track</td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--primary)' }}>64 Disks (Legend)</td>
                  <td>(2⁶⁴) - 1</td>
                  <td style={{ color: 'var(--danger)' }}>18 Quintillion steps</td>
                  <td>Exceeds the age of the Universe</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="concept-variants">
          <h3>🚀 REAL-WORLD APPLICATIONS</h3>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
             <li>
                <strong style={{ color: 'var(--primary)' }}>Algorithm Benchmarking:</strong> 
                Demonstrates pure exponential time complexity (O(2ⁿ)) logic models, widely used as a standard benchmark in computational theory for evaluating execution stacks and recursion depth limits.
             </li>
             <li>
                <strong style={{ color: 'var(--primary)' }}>Data Backup Rotation Methods:</strong> 
                The algorithm's logical restrictions map perfectly to the "Tower of Hanoi" server backup rotation scheme, dictating how to overwrite tapes to maximize historical archive retention while minimizing media swapping.
             </li>
             <li>
                <strong style={{ color: 'var(--primary)' }}>Neuropsychological Evaluation:</strong> 
                Routinely utilized in clinical cognitive assessments (such as the valid Tower of London test variants) to evaluate executive functioning, frontal lobe deficits, and multi-step spatial anticipation capabilities.
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
