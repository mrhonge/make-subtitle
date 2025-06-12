import { useState, useEffect } from 'react';

export default function PresentationScreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [currentSlide, setCurrentSlide] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 메인 창으로부터의 메시지 수신
    const handleMessage = (event) => {
      // 보안을 위해 메시지 출처 확인
      if (event.origin !== window.location.origin) return;

      const { type, data } = event.data;
      switch (type) {
        case 'SLIDE_CONTENT':
          setCurrentSlide(data);
          setIsConnected(true);
          break;
        case 'BLACKOUT':
          setIsBlackout(data);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // 연결 상태 알림
    if (window.opener) {
      window.opener.postMessage({ type: 'SCREEN_READY' }, window.location.origin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // 전체 화면 전환 함수
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // ESC 키로 전체 화면 해제 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const renderSlideContent = (content) => {
    if (!content) return null;

    return content.split('\n').map((line, lineIdx) => {
      if (line.startsWith('(·)')) {
        // 들여쓰기된 대사 처리
        const content = line.slice(4);
        return (
          <div key={lineIdx} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: 24,
            fontSize: 36,
            lineHeight: 2.0
          }}>
            <div style={{ 
              flex: '0 0 160px',
              visibility: 'hidden',
              lineHeight: 2.0
            }}>(·)</div>
            <div style={{ 
              flex: 1,
              whiteSpace: 'pre-line',
              lineHeight: 2.0
            }}>{content}</div>
          </div>
        );
      }

      const roleMatch = line.match(/^\(([^)]+)\)\s*(.*)$/s);
      const effectMatch = line.match(/^\[(♪|♬)?\s*([^\]]+)\]$/s);
      
      if (roleMatch) {
        const [_, role, content] = roleMatch;
        return (
          <div key={lineIdx} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: 24,
            fontSize: 36,
            lineHeight: 2.0
          }}>
            <div style={{ 
              flex: '0 0 160px',
              fontWeight: 700,
              lineHeight: 2.0
            }}>{`(${role})`}</div>
            <div style={{ 
              flex: 1,
              whiteSpace: 'pre-line',
              lineHeight: 2.0
            }}>{content}</div>
          </div>
        );
      } else if (effectMatch) {
        return (
          <div key={lineIdx} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            marginBottom: 24,
            fontSize: 36,
            lineHeight: 2.0
          }}>
            <div style={{ 
              fontWeight: 700,
              lineHeight: 2.0
            }} dangerouslySetInnerHTML={{ 
              __html: `[${effectMatch[1] || ''}${effectMatch[2]}]` 
            }} />
          </div>
        );
      }
      return (
        <div key={lineIdx} style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          marginBottom: 24,
          whiteSpace: 'pre-line',
          lineHeight: 2.0,
          fontSize: 36
        }} dangerouslySetInnerHTML={{ __html: line }} />
      );
    });
  };

  return (
    <div className="presentation-screen">
      {isBlackout ? (
        <div className="blackout-overlay" />
      ) : !isConnected || !currentSlide ? (
        <div className="connection-message">
          발표자 화면에 연결 중...
        </div>
      ) : (
        <div className="slide-content">
          {renderSlideContent(currentSlide)}
        </div>
      )}

      {/* 전체 화면 전환 버튼 */}
      <button 
        className="fullscreen-button"
        onClick={toggleFullscreen}
        title={isFullscreen ? "전체 화면 종료 (ESC)" : "전체 화면으로 보기"}
      >
        {isFullscreen ? "⊖" : "⊕"}
      </button>

      <style jsx>{`
        .presentation-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blackout-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: black;
          z-index: 1000;
        }

        .connection-message {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.7);
        }

        .slide-content {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
          font-family: 'Noto Sans KR', sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100vh;
        }

        .fullscreen-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 1001;
        }

        .fullscreen-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
} 