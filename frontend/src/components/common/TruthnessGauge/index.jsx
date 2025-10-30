import { useState, useEffect } from 'react';
import GaugeComponent from 'react-gauge-component';
import './styles.css';

export default function TruthnessGauge({ score, label }) {
  const [displayPercent, setDisplayPercent] = useState(0);
  const percentage = score || 0;
  const percent = percentage / 100;

  useEffect(() => {
    setDisplayPercent(0);
    const timer = setTimeout(() => {
      setDisplayPercent(percent);
    }, 200);
    return () => clearTimeout(timer);
  }, [percent, score]);

  const getMeterColor = () => {
    if (percentage < 50) return '#c74a4a'; 
    if (percentage >= 50 && percentage < 66) return '#d4a574';
    return '#3d9d7a';
  };

  return (
    <div className="truthness-gauge">
      <GaugeComponent
        id="truthness-gauge-chart"
        type="radial"
        arc={{
          width: 0.3,
          padding: 0,
          cornerRadius: 1,
          subArcs: displayPercent >= 1 ? [
            {
              limit: 100,
              color: getMeterColor(),
              showTick: false
            }
          ] : [
            {
              limit: Math.max(displayPercent * 100, 1),
              color: getMeterColor(),
              showTick: false
            },
            {
              limit: 100,
              color: '#3a3a3a',
              showTick: false
            }
          ],
          gradient: false
        }}
        pointer={{
          color: '#e0e0e0',
          length: 0.80,
          width: 15,
          elastic: false,
          animationDelay: 0,
          animationDuration: 1500
        }}
        value={displayPercent * 100}
        minValue={0}
        maxValue={100}
        labels={{
          valueLabel: {
            hide: true
          },
          tickLabels: {
            hideMinMax: true,
            defaultTickValueConfig: {
              hide: true
            }
          }
        }}
        style={{
          width: '100%'
        }}
      />
      
      <div className="gauge-content">
        <div className="gauge-score">{percentage.toFixed(0)}%</div>
        <div className="gauge-label">{label || 'UNKNOWN'}</div>
      </div>
    </div>
  );
}
