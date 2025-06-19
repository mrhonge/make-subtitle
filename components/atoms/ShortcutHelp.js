import React, { useState } from 'react';
import styles from './ShortcutHelp.module.css';

export default function ShortcutHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Shift + Enter', desc: '들여쓰기된 새 줄 추가' },
    { key: 'Ctrl/Cmd + Z', desc: '실행 취소' },
    { key: 'Ctrl/Cmd + Y', desc: '다시 실행' },
    { key: 'Ctrl/Cmd + Enter', desc: '편집 모드 종료' },
    { key: 'Ctrl/Cmd + Shift + A', desc: '새 슬라이드 추가' },
    { key: 'Delete', desc: '빈 슬라이드 삭제' },
  ];

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={styles.shortcutButton}
      >
        ⌨️
      </button>

      {/* 모달 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            onClick={() => setIsOpen(false)}
            className={styles.shortcutModalBackdrop}
          />
          {/* 모달 내용 */}
          <div className={styles.shortcutModalContent}>
            <h3 className={styles.shortcutTitle}>
              <span>⌨️</span> 단축키 도움말
            </h3>
            <ul className={styles.shortcutList}>
              {shortcuts.map((s, i) => (
                <li key={i} className={styles.shortcutListItem}>
                  <span className={styles.shortcutKey}>{s.key}</span>
                  <span className={styles.shortcutDesc}>{s.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
} 