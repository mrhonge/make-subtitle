import { useState } from 'react';

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
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          transition: 'transform 0.2s',
          zIndex: 1000,
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        ⌨️
      </button>

      {/* 모달 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1001,
            }}
          />
          
          {/* 모달 내용 */}
          <div
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '24px',
              width: '300px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '20px',
              zIndex: 1002,
            }}
          >
            <h3 style={{ 
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⌨️</span> 단축키 도움말
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < shortcuts.length - 1 ? '1px solid #eee' : 'none'
                  }}
                >
                  <kbd style={{
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    {shortcut.key}
                  </kbd>
                  <span style={{
                    fontSize: '14px',
                    color: '#666',
                    flex: 1,
                    marginLeft: '12px'
                  }}>
                    {shortcut.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
} 