import React from 'react';
import styles from './SlidePreview.module.css';

export default function SlidePreview({ slide, onClick, isActive, idx }) {
  return (
    <div
      onClick={onClick}
      className={isActive ? `${styles.slidePreview} ${styles.slidePreviewActive}` : styles.slidePreview}
    >
      <div className={styles.slideTitle}>
        슬라이드 {idx + 1}
      </div>
      {slide.split('\n').map((line, lineIdx, lines) => {
        const nextLine = lineIdx < lines.length - 1 ? lines[lineIdx + 1] : null;
        const nextIsIndented = nextLine && nextLine.startsWith('(·)');
        const isIndented = line.startsWith('(·)');
        if (isIndented) {
          const content = line.slice(4);
          return (
            <div key={lineIdx} className={`${styles.lineRow}`}> 
              <div className={`${styles.lineRole} ${styles.lineRoleHidden}`}>(·)</div>
              <div className={styles.lineContent}>{content}</div>
            </div>
          );
        }
        const roleMatch = line.match(/^\(([^)]+)\)\s*(.*)$/s);
        const effectMatch = line.match(/^\[(♪|♬)?\s*([^\]]+)\]$/s);
        if (roleMatch) {
          return (
            <div key={lineIdx} className={styles.lineRow}>
              <div className={styles.lineRole}>({roleMatch[1]})</div>
              <div className={styles.lineContent}>{roleMatch[2]}</div>
            </div>
          );
        } else if (effectMatch) {
          return (
            <div
              key={lineIdx}
              className={
                effectMatch[1]
                  ? `${styles.lineEffect} ${styles.lineEffectMusic}`
                  : styles.lineEffect
              }
            >
              [{effectMatch[1] || ''}{effectMatch[2]}]
            </div>
          );
        } else {
          return (
            <div key={lineIdx} className={styles.lineContent} style={{ padding: '8px 0' }}>{line}</div>
          );
        }
      })}
    </div>
  );
} 