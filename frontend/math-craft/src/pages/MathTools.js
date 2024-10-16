/* global Desmos */
import React, { useEffect } from 'react';
import './MathTools.css';

const MathTools = () => {
  useEffect(() => {
    const elt = document.getElementById('calculator');
    if (elt && typeof Desmos !== 'undefined') {
      const calculator = Desmos.GraphingCalculator(elt, {
        // Keeping default settings to preserve all tools and functionality
        fontSize: 16 // Increase font size for better readability
      });

      // Optional: Add a default graph if desired
      calculator.setExpression({ id: 'graph1', latex: 'y=x^2' });

      // Adjust the graph bounds for better visibility
      calculator.setMathBounds({
        left: -10,
        right: 10,
        bottom: -10,
        top: 10
      });
    }
  }, []);

  return (
    <div className="math-tools-container">
      <div id="calculator" className="math-tools-calculator"></div>
    </div>
  );
};

export default MathTools;