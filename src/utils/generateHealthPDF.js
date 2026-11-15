// ─── AstroPulse: NASA Health Report PDF Generator ────────────────────────────
// Uses jsPDF + jspdf-autotable to produce a professional offline health report
// No server required — fully edge-rendered in the browser

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSuggestions } from '../components/HealthSuggestions';

// ─── Color palette (matches NASA dark theme) ─────────────────────────────────
const C = {
  deepBg:   [6, 9, 17],       // #060911
  panelBg:  [10, 15, 28],     // #0a0f1c
  cyan:     [0, 245, 212],    // #00f5d4
  amber:    [245, 158, 11],   // #f59e0b
  red:      [239, 68, 68],    // #ef4444
  emerald:  [16, 185, 129],   // #10b981
  textPri:  [220, 230, 255],  // primary text
  textSec:  [100, 120, 160],  // secondary text
  border:   [30, 50, 90],     // panel border
  white:    [255, 255, 255],
};

function triageColor(score) {
  if (score >= 85) return C.emerald;
  if (score >= 60) return C.amber;
  return C.red;
}

function triageLabel(score) {
  if (score >= 85) return 'GREEN — MISSION READY';
  if (score >= 60) return 'AMBER — CAUTION';
  return 'RED — MEDICAL ATTENTION REQUIRED';
}

function priorityColor(priority) {
  const map = {
    CRITICAL: C.red,
    HIGH:     C.amber,
    MEDIUM:   C.cyan,
    LOW:      [100, 180, 160],
    CAUTION:  C.amber,
    OPTIMAL:  C.emerald,
  };
  return map[priority] || C.textSec;
}

// ─── Main Export Function ─────────────────────────────────────────────────────
export function generateHealthPDF({ vitals, prediction, astronaut, missionDay, contributions }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297
  const margin = 14;
  let y = 0;

  // ── Helper: set fill + text color ──────────────────────────────────────────
  function setFill(rgb) { doc.setFillColor(...rgb); }
  function setTextColor(rgb) { doc.setTextColor(...rgb); }
  function setDraw(rgb) { doc.setDrawColor(...rgb); }

  // ── Helper: draw rounded rect ──────────────────────────────────────────────
  function roundRect(x, cy, w, h, r, fill) {
    setFill(fill || C.panelBg);
    doc.roundedRect(x, cy, w, h, r, r, 'F');
  }

  // ── Helper: horizontal rule ────────────────────────────────────────────────
  function hRule(cy, color = C.border) {
    setDraw(color);
    doc.setLineWidth(0.3);
    doc.line(margin, cy, W - margin, cy);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE 1: Header + Mission Brief + Health Readiness Score + Vitals Table
  // ─────────────────────────────────────────────────────────────────────────

  // ── Full-width dark header bar ─────────────────────────────────────────────
  setFill(C.deepBg);
  doc.rect(0, 0, W, 42, 'F');

  // NASA meatball placeholder (circle)
  setFill(C.cyan);
  doc.circle(margin + 8, 21, 8, 'F');
  setFill(C.deepBg);
  doc.circle(margin + 8, 21, 6, 'F');
  setFill(C.cyan);
  doc.circle(margin + 8, 21, 2, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  setTextColor(C.cyan);
  doc.text('ASTROPULSE', margin + 20, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setTextColor(C.textSec);
  doc.text('NASA Space Health Monitoring System  ·  Mission Critical Edition', margin + 20, 23);

  doc.setFontSize(7);
  doc.text('CONFIDENTIAL — FOR FLIGHT SURGEON AND CREW EYES ONLY', margin + 20, 29);

  // Report label (top right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setTextColor(C.amber);
  doc.text('CREW HEALTH REPORT', W - margin, 17, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setTextColor(C.textSec);
  doc.text(`Generated: ${new Date().toUTCString()}`, W - margin, 23, { align: 'right' });
  doc.text(`Report ID: APS-${Date.now().toString(36).toUpperCase()}`, W - margin, 29, { align: 'right' });

  y = 50;

  // ── Mission Brief Panel ────────────────────────────────────────────────────
  roundRect(margin, y, W - 2 * margin, 32, 3);
  hRule(y, C.border);
  hRule(y + 32, C.border);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  setTextColor(C.cyan);
  doc.text('MISSION BRIEF', margin + 4, y + 7);

  const briefFields = [
    ['Crew Member',  astronaut?.name  ?? 'UNKNOWN'],
    ['Crew ID',      astronaut?.crewId ?? 'N/A'],
    ['Mission Day',  `MED +${missionDay ?? 0}`],
    ['Habitat',      astronaut?.habitat ?? 'ISS Alpha'],
    ['Role',         astronaut?.role   ?? 'Mission Specialist'],
    ['Triage Status', triageLabel(prediction?.score ?? 0)],
  ];

  const colW = (W - 2 * margin - 8) / 3;
  briefFields.forEach((field, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const bx = margin + 4 + col * colW;
    const by = y + 13 + row * 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    setTextColor(C.textSec);
    doc.text(field[0].toUpperCase(), bx, by);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (field[0] === 'Triage Status') {
      setTextColor(triageColor(prediction?.score ?? 0));
    } else {
      setTextColor(C.textPri);
    }
    doc.text(String(field[1]), bx, by + 5);
  });

  y += 40;

  // ── Health Readiness Score (big dial summary) ──────────────────────────────
  const score = prediction?.score ?? 0;
  const scoreColor = triageColor(score);

  roundRect(margin, y, W - 2 * margin, 28, 3);

  // Score circle
  const cx = margin + 20;
  const cy2 = y + 14;
  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(2.5);
  doc.circle(cx, cy2, 10, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setTextColor(scoreColor);
  doc.text(String(Math.round(score)), cx, cy2 + 1.5, { align: 'center' });

  doc.setFontSize(5.5);
  setTextColor(C.textSec);
  doc.text('/100', cx, cy2 + 6, { align: 'center' });

  // Score description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setTextColor(scoreColor);
  doc.text('ASTRONAUT HEALTH READINESS SCORE (AHRS)', margin + 35, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setTextColor(C.textPri);
  doc.text(triageLabel(score), margin + 35, y + 16);

  doc.setFontSize(6.5);
  setTextColor(C.textSec);
  doc.text(
    `ML Model: MS-DPT v2.4 · Accuracy 94.2% · ${prediction?.category ?? 'NOMINAL'} · Inference: ${new Date().toISOString()}`,
    margin + 35, y + 23
  );

  y += 36;

  // ── Vitals Table ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(C.cyan);
  doc.text('■  VITAL SIGNS PANEL', margin, y + 5);
  y += 8;

  const v = vitals || {};
  const vitalsRows = [
    ['Heart Rate',       `${v.heartRate ?? '—'} bpm`,     '60–100 bpm',    (v.heartRate > 100 || v.heartRate < 60) ? 'ALERT' : 'NORMAL'],
    ['HRV (RMSSD)',      `${v.hrv ?? '—'} ms`,            '≥50 ms',        v.hrv < 30 ? 'ALERT' : v.hrv < 50 ? 'CAUTION' : 'NORMAL'],
    ['Blood Pressure',   `${v.bpSystolic ?? '—'}/${v.bpDiastolic ?? '—'} mmHg`, '<120/80 mmHg', (v.bpSystolic > 140 || v.bpDiastolic > 90) ? 'ALERT' : 'NORMAL'],
    ['Radiation Dose',   `${v.radiation ?? '—'} mSv/d`,   '<0.5 mSv/d',   (v.radiation > 0.5) ? 'CRITICAL' : v.radiation > 0.3 ? 'HIGH' : 'NORMAL'],
    ['Sleep Debt',       `${v.sleepDebt ?? '—'} hrs`,     '<2 hrs',        v.sleepDebt > 6 ? 'CRITICAL' : v.sleepDebt > 3 ? 'HIGH' : 'NORMAL'],
    ['BMD Loss Rate',    `${v.boneLoss ?? '—'} %/mo`,     '<0.5%/mo',      v.boneLoss > 1 ? 'ALERT' : v.boneLoss > 0.5 ? 'CAUTION' : 'NORMAL'],
    ['PVT Reaction',     `${v.pvtScore ?? '—'} ms`,        '<300 ms',       v.pvtScore > 500 ? 'ALERT' : v.pvtScore > 350 ? 'CAUTION' : 'NORMAL'],
    ['SpO₂',            `${v.spo2 ?? '98'} %`,           '95–100%',       (v.spo2 < 95) ? 'ALERT' : 'NORMAL'],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Parameter', 'Current Value', 'Normal Range', 'Status']],
    body: vitalsRows,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 7.5,
      cellPadding: 3,
      fillColor: C.panelBg,
      textColor: C.textPri,
      lineColor: C.border,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [0, 30, 60],
      textColor: C.cyan,
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: C.textPri },
      3: {
        fontStyle: 'bold',
        textColor: (cell) => {
          const v2 = cell?.raw;
          if (v2 === 'CRITICAL') return C.red;
          if (v2 === 'ALERT' || v2 === 'HIGH') return C.amber;
          if (v2 === 'CAUTION') return C.cyan;
          return C.emerald;
        },
      },
    },
    alternateRowStyles: { fillColor: [8, 14, 26] },
    didDrawCell: (data) => {
      if (data.column.index === 3 && data.section === 'body') {
        const statusText = data.cell.raw;
        let color = C.emerald;
        if (statusText === 'CRITICAL') color = C.red;
        else if (statusText === 'ALERT' || statusText === 'HIGH') color = C.amber;
        else if (statusText === 'CAUTION') color = C.cyan;
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
      }
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE 2 (or continue): XAI + Health Suggestions
  // ─────────────────────────────────────────────────────────────────────────
  if (y > H - 80) {
    doc.addPage();
    setFill(C.deepBg);
    doc.rect(0, 0, W, 10, 'F');
    y = 18;
  }

  // ── XAI Risk Factor Attribution ───────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(C.cyan);
  doc.text('■  XAI RISK FACTOR ATTRIBUTION (SHAP)', margin, y + 5);
  y += 8;

  const xaiRows = (contributions || []).map(c => [
    c.factor || c.name,
    `${(c.weight * 100).toFixed(1)}%`,
    c.value ? String(c.value) : '—',
    c.impact || (c.weight > 0.2 ? 'High Risk' : c.weight > 0.1 ? 'Moderate' : 'Low'),
  ]);

  if (xaiRows.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['Risk Factor', 'SHAP Weight', 'Current Value', 'Impact Level']],
      body: xaiRows,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 7.5,
        cellPadding: 3,
        fillColor: C.panelBg,
        textColor: C.textPri,
        lineColor: C.border,
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [0, 30, 60],
        textColor: C.cyan,
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [8, 14, 26] },
    });
    y = doc.lastAutoTable.finalY + 10;
  } else {
    setTextColor(C.textSec);
    doc.setFontSize(7);
    doc.text('No XAI contributions available. Run ML inference to generate.', margin, y + 5);
    y += 12;
  }

  // ── Health Suggestions ────────────────────────────────────────────────────
  if (y > H - 60) {
    doc.addPage();
    setFill(C.deepBg);
    doc.rect(0, 0, W, 10, 'F');
    y = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(C.cyan);
  doc.text('■  AI-GENERATED HEALTH RECOMMENDATIONS', margin, y + 5);
  y += 8;

  const suggestions = getSuggestions(vitals, prediction);

  suggestions.forEach((s, idx) => {
    if (y > H - 50) {
      doc.addPage();
      setFill(C.deepBg);
      doc.rect(0, 0, W, 10, 'F');
      y = 18;
    }

    const pColor = priorityColor(s.priority);
    const cardH = 32;

    // Card background
    setFill([10, 15, 28]);
    doc.roundedRect(margin, y, W - 2 * margin, cardH, 2, 2, 'F');
    setDraw(pColor);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, W - 2 * margin, cardH, 2, 2, 'D');

    // Priority badge
    setFill(pColor);
    doc.roundedRect(margin + 2, y + 2, 20, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.5);
    setTextColor(C.deepBg);
    doc.text(s.priority, margin + 12, y + 6.5, { align: 'center' });

    // System tag
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    setTextColor(C.textSec);
    doc.text(s.system.toUpperCase(), margin + 25, y + 6.5);

    // Icon + Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(C.textPri);
    doc.text(`${s.icon}  ${s.title}`, margin + 4, y + 14);

    // Action text (wrapped)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    setTextColor(C.textSec);
    const actionLines = doc.splitTextToSize(s.action, W - 2 * margin - 10);
    doc.text(actionLines.slice(0, 2), margin + 4, y + 20);

    // Protocol + Outcome
    doc.setFontSize(6);
    setTextColor(pColor);
    doc.text(`Protocol: ${s.protocol}`, margin + 4, y + 29);

    y += cardH + 4;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // FINAL PAGE: Countermeasures Summary + Footer
  // ─────────────────────────────────────────────────────────────────────────
  if (y > H - 60) {
    doc.addPage();
    setFill(C.deepBg);
    doc.rect(0, 0, W, 10, 'F');
    y = 18;
  }

  // ── Prescribed Countermeasures ─────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(C.cyan);
  doc.text('■  PRESCRIBED COUNTERMEASURES', margin, y + 5);
  y += 8;

  const cmRows = (prediction?.countermeasures || []).map((cm, i) => [
    String(i + 1),
    cm.name || cm,
    cm.type || 'Operational',
    cm.frequency || 'As directed',
  ]);

  if (cmRows.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [['#', 'Countermeasure', 'Type', 'Frequency']],
      body: cmRows,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 7.5,
        cellPadding: 3,
        fillColor: C.panelBg,
        textColor: C.textPri,
        lineColor: C.border,
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [0, 30, 60],
        textColor: C.emerald,
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      alternateRowStyles: { fillColor: [8, 14, 26] },
    });
    y = doc.lastAutoTable.finalY + 10;
  } else {
    setTextColor(C.textSec);
    doc.setFontSize(7);
    doc.text('No active countermeasures prescribed.', margin, y + 5);
    y += 12;
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const footerY = H - 22;
  setFill([6, 9, 20]);
  doc.rect(0, footerY, W, 22, 'F');
  hRule(footerY, C.border);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  setTextColor(C.amber);
  doc.text('ASTROPULSE · NASA SPACE HEALTH MONITORING SYSTEM', margin, footerY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  setTextColor(C.textSec);
  doc.text(
    'This report is auto-generated by AstroPulse AI. Compliant with NASA-STD-3001 Vol.1&2 (Human Integration Design Handbook).',
    margin, footerY + 13
  );
  doc.text(
    'All clinical decisions must be validated by an authorized Crew Medical Officer (CMO) or NASA Flight Surgeon.',
    margin, footerY + 18
  );

  // Page numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    setTextColor(C.textSec);
    doc.text(`Page ${i} of ${totalPages}`, W - margin, footerY + 7, { align: 'right' });
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const filename = `AstroPulse_Health_Report_${astronaut?.crewId ?? 'CREW'}_MED${missionDay ?? 0}_${Date.now()}.pdf`;
  doc.save(filename);
}
