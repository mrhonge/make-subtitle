import { useState, useEffect, useRef, useCallback } from 'react';

const PresentationMode = ({ slides, isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isDualScreen, setIsDualScreen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const presentationRef = useRef(null);
  const presentationWindowRef = useRef(null);

  // 타이머 설정
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
      setElapsedTime(0);
    };
  }, [isOpen]);

  // 시간 포맷팅 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 전체 화면 전환 함수
  const enterFullscreen = async () => {
    if (!presentationRef.current) return;
    
    try {
      if (presentationRef.current.requestFullscreen) {
        await presentationRef.current.requestFullscreen();
      } else if (presentationRef.current.webkitRequestFullscreen) {
        await presentationRef.current.webkitRequestFullscreen();
      }
      setIsFullscreenMode(true);
    } catch (err) {
      console.error('전체 화면 전환 중 오류:', err);
    }
  };

  const exitFullscreen = () => {
    if (!document.fullscreenElement) return;
    
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreenMode(false);
    } catch (err) {
      console.error('전체 화면 종료 중 오류:', err);
    }
  };

  // 듀얼 스크린 모드 시작
  const startDualScreen = async () => {
    try {
      // 새 창 열기
      const presWindow = window.open(
        '/presentation-screen',
        'PresentationScreen',
        'popup=yes,fullscreen=yes'
      );
      
      if (presWindow) {
        presentationWindowRef.current = presWindow;
        setIsDualScreen(true);
      }
    } catch (error) {
      console.error('듀얼 스크린 시작 중 오류:', error);
    }
  };

  // 듀얼 스크린 모드 종료
  const stopDualScreen = () => {
    if (presentationWindowRef.current) {
      presentationWindowRef.current.close();
      presentationWindowRef.current = null;
    }
    setIsDualScreen(false);
  };

  // 청중 화면으로 현재 슬라이드 내용 전송
  useEffect(() => {
    if (isDualScreen && presentationWindowRef.current) {
      presentationWindowRef.current.postMessage({
        type: 'SLIDE_CONTENT',
        data: slides[currentSlide]
      }, window.location.origin);
    }
  }, [currentSlide, slides, isDualScreen]);

  // 블랙아웃 상태 전송
  useEffect(() => {
    if (isDualScreen && presentationWindowRef.current) {
      presentationWindowRef.current.postMessage({
        type: 'BLACKOUT',
        data: isBlackout
      }, window.location.origin);
    }
  }, [isBlackout, isDualScreen]);

  // 창 닫힘 감지
  useEffect(() => {
    const checkWindow = setInterval(() => {
      if (presentationWindowRef.current && presentationWindowRef.current.closed) {
        setIsDualScreen(false);
        presentationWindowRef.current = null;
      }
    }, 1000);

    return () => {
      clearInterval(checkWindow);
      if (presentationWindowRef.current) {
        presentationWindowRef.current.close();
      }
    };
  }, []);

  // 키보드 단축키 처리
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
      case 'Enter':
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
        break;
      case 'ArrowLeft':
      case 'Backspace':
        setCurrentSlide(prev => Math.max(prev - 1, 0));
        break;
      case 'Escape':
        if (isBlackout) {
          setIsBlackout(false);
        } else if (isFullscreenMode) {
          exitFullscreen();
        } else {
          onClose();
        }
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        isFullscreenMode ? exitFullscreen() : enterFullscreen();
        break;
      case 'b':
      case 'B':
        e.preventDefault();
        setIsBlackout(prev => !prev);
        break;
      case 'd':
      case 'D':
        e.preventDefault();
        isDualScreen ? stopDualScreen() : startDualScreen();
        break;
      default:
        break;
    }
  }, [isOpen, slides.length, isFullscreenMode, isBlackout, isDualScreen, onClose]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // 컴포넌트가 언마운트될 때 정리
  useEffect(() => {
    if (!isOpen) {
      stopDualScreen();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="presentation-mode" ref={presentationRef}>
      {isBlackout && (
        <div 
          className="blackout-overlay"
          onClick={() => setIsBlackout(false)}
        />
      )}
      <div className="presenter-view">
        <div className="current-slide">
          <div className="slide-content">
            {slides[currentSlide].split('\n').map((line, lineIdx) => {
              const roleMatch = line.match(/^\(([^)]+)\)\s*(.*)$/s);
              const effectMatch = line.match(/^\[(♪|♬)?\s*([^\]]+)\]$/s);
              
              if (roleMatch) {
                const [_, role, content] = roleMatch;
                return (
                  <div key={lineIdx} className="line">
                    <span className="role">{`(${role})`}</span>
                    <span className="content" dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                );
              } else if (effectMatch) {
                return (
                  <div key={lineIdx} className="line">
                    <span className="role" dangerouslySetInnerHTML={{ 
                      __html: `[${effectMatch[1] || ''}${effectMatch[2]}]` 
                    }} />
                  </div>
                );
              }
              return (
                <div key={lineIdx} className="line" dangerouslySetInnerHTML={{ __html: line }} />
              );
            })}
          </div>
        </div>

        {currentSlide < slides.length - 1 && (
          <div className="next-slide-preview">
            <h3>다음 슬라이드</h3>
            <div className="preview-content">
              {slides[currentSlide + 1].split('\n').slice(0, 3).map((line, idx) => (
                <div key={idx} className="preview-line">{line}</div>
              ))}
              {slides[currentSlide + 1].split('\n').length > 3 && (
                <div className="preview-more">...</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="controls">
        <button 
          className="nav-btn prev-btn"
          onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
          disabled={currentSlide === 0}
        >
          이전
        </button>
        <span className="slide-info">
          <span className="slide-number">{currentSlide + 1} / {slides.length}</span>
          <span className="timer">{formatTime(elapsedTime)}</span>
        </span>
        <button 
          className="nav-btn next-btn"
          onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
          disabled={currentSlide === slides.length - 1}
        >
          다음
        </button>
        <div className="right-controls">
          <button 
            className="control-btn"
            onClick={() => isDualScreen ? stopDualScreen() : startDualScreen()}
            title="듀얼 스크린 (D)"
          >
            {isDualScreen ? '화면 분리 종료' : '화면 분리하기'}
          </button>
          <button 
            className="control-btn"
            onClick={() => setIsBlackout(prev => !prev)}
            title="화면 가리기 (B)"
          >
            {isBlackout ? '화면 보이기' : '화면 가리기'}
          </button>
          <button 
            className="control-btn"
            onClick={isFullscreenMode ? exitFullscreen : enterFullscreen}
            title="전체 화면 (F)"
          >
            {isFullscreenMode ? '전체 화면 종료' : '전체 화면으로 보기'}
          </button>
          <button className="control-btn" onClick={onClose} title="ESC">
            닫기
          </button>
        </div>
      </div>

      <style jsx>{`
        .presentation-mode {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          color: #fff;
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }

        .presenter-view {
          flex: 1;
          display: flex;
          padding: 20px;
          gap: 20px;
        }

        .current-slide {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .next-slide-preview {
          width: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .next-slide-preview h3 {
          margin: 0;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
        }

        .preview-content {
          font-size: 14px;
          opacity: 0.7;
        }

        .preview-line {
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preview-more {
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
        }

        .slide-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 32px;
          line-height: 1.6;
          font-family: 'Noto Sans KR', sans-serif;
        }

        .line {
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          padding: 8px;
          border-radius: 4px;
        }

        .role {
          font-weight: 700;
          min-width: 120px;
          margin-right: 32px;
        }

        .content {
          flex: 1;
        }

        .controls {
          display: flex;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.8);
          gap: 16px;
        }

        .right-controls {
          margin-left: auto;
          display: flex;
          gap: 8px;
        }

        .nav-btn,
        .control-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .nav-btn:hover:not(:disabled),
        .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .slide-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .slide-number {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .timer {
          margin-left: 16px;
          font-family: monospace;
          color: rgba(255, 255, 255, 0.7);
        }

        .blackout-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: black;
          z-index: 10000;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PresentationMode; 