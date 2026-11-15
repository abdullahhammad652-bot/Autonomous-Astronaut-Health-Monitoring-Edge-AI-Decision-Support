import React, { useRef, useEffect } from 'react';

export default function TelemetryCanvas({ heartRate = 72, hrv = 45 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    // ECG wave points template
    const ecgPattern = [0, 0, 0, 0.05, -0.05, 0, 0, 0, -0.15, 0.95, -0.3, 0, 0, 0.15, 0.2, 0.1, 0, 0, 0];
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    const buffer = new Array(width).fill(midY);

    const render = () => {
      step++;
      // Determine frequency based on HR
      const cycleLength = Math.max(25, Math.round(1800 / heartRate));
      const phase = step % cycleLength;
      
      let nextY = midY;
      if (phase < ecgPattern.length) {
        nextY = midY - (ecgPattern[phase] * 32);
      } else {
        // slight microgravity fluid noise
        nextY = midY + (Math.sin(step * 0.1) * 2);
      }

      buffer.shift();
      buffer.push(nextY);

      // Clear with dark grid
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Draw faint telemetry grid
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ECG Line with glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f5d4';
      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        if (i === 0) ctx.moveTo(i, buffer[i]);
        else ctx.lineTo(i, buffer[i]);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw pulse head indicator
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(width - 4, buffer[width - 1], 3, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [heartRate, hrv]);

  return (
    <div className="telemetry-waveform-card">
      <div className="telemetry-header">
        <span className="telemetry-title">LEAD-II TELEMETRY WAVEFORM (REAL-TIME BIO-SENSOR)</span>
        <span className="telemetry-tags">
          <span className="tag-live">● SENSOR ACTIVE</span>
          <span className="tag-meta">HR: {heartRate} BPM | HRV: {hrv} ms</span>
        </span>
      </div>
      <canvas ref={canvasRef} width={680} height={110} className="ecg-canvas" />
    </div>
  );
}
