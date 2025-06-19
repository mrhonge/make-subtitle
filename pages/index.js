import { useState } from 'react';
import GuideModal from '../components/modals/GuideModal';
import PresentationMode from '../components/organisms/PresentationMode';
import ShortcutHelp from '../components/atoms/ShortcutHelp';
import TutorialModal from '../components/modals/TutorialModal';
import CaptionTipModal from '../components/modals/CaptionTipModal';
import SlideList from '../components/organisms/SlideList';

export default function Home() {
  const [script, setScript] = useState('');
  const [slides, setSlides] = useState([]);
  const [saveMsg, setSaveMsg] = useState('');
  const [editModes, setEditModes] = useState([]);
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isCaptionTipOpen, setIsCaptionTipOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '', type: '' });
  
  // 편집 히스토리 관리
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeSlideIdx, setActiveSlideIdx] = useState(null);

  // 저장된 작업이 있는지 확인
  const hasRecentWork = () => {
    try {
      const data = localStorage.getItem('caption-slides');
      return data !== null && JSON.parse(data).length > 0;
    } catch (e) {
      return false;
    }
  };

  // 히스토리에 상태 추가
  const addToHistory = (newSlides) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      slides: [...newSlides],
      activeSlide: activeSlideIdx
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo 함수
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setSlides([...prevState.slides]);
      setHistoryIndex(historyIndex - 1);
      setSaveMsg('실행 취소됨');
      setTimeout(() => setSaveMsg(''), 1000);
    }
  };

  // Redo 함수
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setSlides([...nextState.slides]);
      setHistoryIndex(historyIndex + 1);
      setSaveMsg('다시 실행됨');
      setTimeout(() => setSaveMsg(''), 1000);
    }
  };

  // 파일 처리 함수
  const processFile = (file) => {
    if (!file.name.endsWith('.txt')) {
      setErrorModal({
        isOpen: true,
        message: 'txt 파일만 업로드 가능합니다.',
        type: 'error'
      });
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setScript(event.target.result);
      const newSlides = parseScript(event.target.result);
      setSlides(newSlides);
      setEditModes(new Array(newSlides.length).fill(false));
      setHistory([{ slides: newSlides, activeSlide: null }]);
      setHistoryIndex(0);
      setActiveSlideIdx(null);
      setIsLoading(false);
    };
    reader.readAsText(file, 'utf-8');
  };

  // .txt 파일 업로드 및 읽기
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  // 드롭존 파일 업로드 핸들러
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // 대본 파싱: --- 기준으로 슬라이드 분할
  function parseScript(text) {
    return text
      .split(/---+/)
      .map((slide) => slide.trim())
      .filter((slide) => slide.length > 0);
  }

  // 슬라이드 저장 기능
  const handleSaveSlides = () => {
    try {
      localStorage.setItem('caption-slides', JSON.stringify(slides));
      setSaveMsg('슬라이드가 성공적으로 저장되었습니다!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (e) {
      setSaveMsg('저장에 실패했습니다.');
      setTimeout(() => setSaveMsg(''), 2000);
    }
  };

  // 슬라이드 불러오기 기능
  const handleLoadSlides = () => {
    try {
      const data = localStorage.getItem('caption-slides');
      if (!data) {
        setSaveMsg('저장된 슬라이드가 없습니다.');
        setTimeout(() => setSaveMsg(''), 2000);
        return;
      }
      let loadedSlides = JSON.parse(data);
      loadedSlides = loadedSlides.map(slide => typeof slide === 'string' ? slide : JSON.stringify(slide));
      setSlides(loadedSlides);
      setEditModes(new Array(loadedSlides.length).fill(false));
      setSaveMsg('슬라이드를 성공적으로 불러왔습니다!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (e) {
      setSaveMsg('불러오기에 실패했습니다.');
      setTimeout(() => setSaveMsg(''), 2000);
    }
  };

  // 대본 txt 파일 다운로드
  const handleDownloadScript = () => {
    const scriptContent = slides.join('\n---\n');
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '대본.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSaveMsg('대본이 다운로드되었습니다!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  // 편집 모드 토글 함수
  const toggleEditMode = (idx) => {
    const newEditModes = [...editModes];
    newEditModes[idx] = !newEditModes[idx];
    setEditModes(newEditModes);
    setActiveSlideIdx(newEditModes[idx] ? idx : null);
  };

  // 새 슬라이드 추가 함수
  const addNewSlide = (idx) => {
    const newSlides = [...slides];
    newSlides.splice(idx + 1, 0, '');
    setSlides(newSlides);
    
    const newEditModes = [...editModes];
    newEditModes.splice(idx + 1, 0, true);
    setEditModes(newEditModes);
    
    addToHistory(newSlides);
  };

  // 슬라이드 삭제 함수
  const handleDeleteSlide = (idx) => {
    if (window.confirm('이 슬라이드를 삭제하시겠습니까?')) {
      const newSlides = [...slides];
      const newEditModes = [...editModes];
      newSlides.splice(idx, 1);
      newEditModes.splice(idx, 1);
      setSlides(newSlides);
      setEditModes(newEditModes);
      addToHistory(newSlides);
      setSaveMsg('슬라이드가 삭제되었습니다.');
      setTimeout(() => setSaveMsg(''), 2000);
    }
  };

  // 슬라이드 복제 함수
  const handleDuplicateSlide = (idx) => {
    const newSlides = [...slides];
    const newEditModes = [...editModes];
    newSlides.splice(idx + 1, 0, slides[idx]);
    newEditModes.splice(idx + 1, 0, false);
    setSlides(newSlides);
    setEditModes(newEditModes);
    addToHistory(newSlides);
    setSaveMsg('슬라이드가 복제되었습니다.');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  // 슬라이드 내용 변경 시 히스토리 추가
  const handleSlideChange = (idx, newContent) => {
    const newSlides = [...slides];
    newSlides[idx] = newContent;
    setSlides(newSlides);
    addToHistory(newSlides);
  };

  // Let's Play 버튼 클릭 핸들러
  const handleLetsPlay = () => {
    document.getElementById('file-upload').click();
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', position: 'relative' }}>
      {slides.length === 0 ? (
        // 새로운 랜딩 페이지 UI
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          padding: '60px 20px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          background: '#ffffff',
          minHeight: '100vh'
        }}>
          
          {/* 홍보 문구 섹션 */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: 'clamp(24px, 4vw, 36px)', 
              fontWeight: '700', 
              color: '#1976d2', 
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              몇 번의 클릭으로 자막 생성부터 편집, 송출까지!
            </h1>
            <p style={{ 
              fontSize: 'clamp(16px, 2.5vw, 20px)', 
              color: '#666', 
              fontWeight: '500',
              margin: '0'
            }}>
              연극인을 위한 올인원 자막 솔루션
            </p>
          </div>

                    {/* 서비스 제목 */}
          <div style={{ 
            fontSize: 'clamp(32px, 5vw, 48px)', 
            fontWeight: '800', 
            color: '#333', 
            marginBottom: '60px',
            textAlign: 'center'
          }}>
            Play Caption
          </div>

          {/* 주요 액션 영역 - 통합된 드래그 앤 드롭 + Let's Play */}
          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '60px' }}>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-upload').click()}
              style={{
                border: isDragging ? '3px solid #1976d2' : '2px dashed #1976d2',
                background: isDragging ? '#e3f2fd' : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                borderRadius: '16px',
                padding: '50px 30px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isDragging ? '0 12px 32px rgba(25, 118, 210, 0.3)' : '0 8px 24px rgba(25, 118, 210, 0.15)',
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                position: 'relative'
              }}
            >
              {/* Let's Play! 버튼 */}
              <div style={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                borderRadius: '12px',
                padding: '20px 40px',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '30px',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                display: 'inline-block',
                transition: 'all 0.3s ease'
              }}>
                🎭 Let's Play!
              </div>

              {/* 파일 아이콘 및 설명 */}
              <div style={{ 
                fontSize: '18px', 
                color: '#666', 
                fontWeight: '500',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}>
                📄 대본 파일(.txt)을 <strong>드래그</strong>하거나 이곳을 <strong>클릭</strong>해서 업로드하세요.
              </div>

              {/* 드래그 중일 때 오버레이 */}
              {isDragging && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(25, 118, 210, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1976d2'
                }}>
                  📁 파일을 여기에 놓으세요!
                </div>
              )}
            </div>
            <input 
              id="file-upload" 
              type="file" 
              accept=".txt" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
          </div>

          {/* 보조 액션 영역 */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            width: '100%', 
            maxWidth: '400px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            <button
              onClick={handleLoadSlides}
              disabled={!hasRecentWork()}
              style={{
                background: 'transparent',
                border: '2px solid #1976d2',
                color: hasRecentWork() ? '#1976d2' : '#ccc',
                borderColor: hasRecentWork() ? '#1976d2' : '#ccc',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: hasRecentWork() ? 'pointer' : 'not-allowed',
                opacity: hasRecentWork() ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
            >
              📂 최근 작업 불러오기
            </button>
            <button
              onClick={() => setIsGuideOpen(true)}
              style={{
                background: 'transparent',
                border: '2px solid #43a047',
                color: '#43a047',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📋 대본 가이드
            </button>
          </div>

          {/* 구분선 */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #e0e0e0 20%, #bdbdbd 50%, #e0e0e0 80%, transparent 100%)',
            margin: '40px 0',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              padding: '0 16px',
              fontSize: '24px'
            }}>
              ✨
            </div>
          </div>

          {/* How to Use 섹션 */}
          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#333', 
              textAlign: 'center', 
              marginBottom: '30px' 
            }}>
              How to Use
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <span style={{ 
                  background: '#1976d2', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '700',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  1
                </span>
                <div style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
                  <span 
                    style={{ 
                      textDecoration: 'underline', 
                      cursor: 'pointer', 
                      color: '#1976d2',
                      fontWeight: '600'
                    }}
                    onClick={() => setIsGuideOpen(true)}
                  >
                    대본 가이드 ℹ️
                  </span>를 확인하고 형식에 맞게 대본을 편집하세요.
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <span style={{ 
                  background: '#43a047', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '700',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  2
                </span>
                <div style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
                  파일을 업로드하면 자동으로 자막 슬라이드가 만들어집니다.
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <span style={{ 
                  background: '#9c27b0', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '700',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  3
                </span>
                <div style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
                  편집 후 프레젠테이션 기능을 이용해 송출하세요.
                </div>
              </div>
            </div>
                    </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{ 
                fontSize: '48px', 
                color: '#1976d2', 
                marginBottom: '16px',
                animation: 'spin 1.2s linear infinite'
              }}>
                ⏳
              </div>
              <div style={{ 
                fontSize: '20px', 
                color: '#fff', 
                fontWeight: '600',
                textAlign: 'center'
              }}>
                대본을 분석 중입니다...
              </div>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* 메시지 표시 */}
          {saveMsg && (
            <div style={{ 
              marginTop: '20px',
              padding: '12px 24px',
              background: '#e3f2fd',
              color: '#1976d2',
              borderRadius: '8px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {saveMsg}
            </div>
          )}

          {/* 모바일 대응 스타일 */}
          <style>{`
            @media (max-width: 768px) {
              .primary-action-section {
                width: 100% !important;
                padding: 0 16px !important;
              }
              .secondary-action-section {
                flex-direction: column !important;
                align-items: center !important;
              }
              .secondary-action-section button {
                width: 100% !important;
                max-width: 280px !important;
              }
            }
          `}</style>
        </div>
      ) : (
        // 기존 슬라이드 편집 UI
        <div
          style={{ width: '100vw', minHeight: '100vh', position: 'relative', background: '#f8fafc' }}
          onClick={() => {
            if (activeSlideIdx !== null) {
              setEditModes(editModes.map(() => false));
              setActiveSlideIdx(null);
            }
          }}
        >
          {/* 프레젠테이션 시작 고정 버튼 */}
          <button
            onClick={() => setShowPresentation(true)}
            style={{
              position: 'fixed',
              top: 28,
              right: 32,
              zIndex: 100,
              padding: '12px 28px',
              fontSize: 18,
              background: '#9c27b0',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(156,39,176,0.10)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 22 }}>▶️</span> 프레젠테이션 시작
          </button>
          
          <div style={{
            display: 'flex', 
            flexDirection: 'row', 
            maxWidth: 1200, 
            margin: '0 auto', 
            height: '100vh', 
            boxSizing: 'border-box', 
            padding: 0,
          }}>
            {/* 좌측: 슬라이드 목록 */}
            <aside style={{
              width: 260, 
              minWidth: 180, 
              maxWidth: 320, 
              background: '#fff', 
              borderRight: '1.5px solid #e3e3e3', 
              padding: '32px 0 32px 0', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
            }}>
              <h2 style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: '#1976d2', 
                marginBottom: 18 
              }}>
                슬라이드 목록
              </h2>
              <div style={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 8 
              }}>
                {slides.map((slide, idx) => (
                  <div
                    key={idx}
                    onClick={e => { 
                      e.stopPropagation(); 
                      setEditModes(editModes.map((_, i) => i === idx)); 
                      setActiveSlideIdx(idx); 
                    }}
                    style={{
                      background: activeSlideIdx === idx ? '#e3f2fd' : '#f8fafc',
                      border: activeSlideIdx === idx ? '2px solid #1976d2' : '1.5px solid #e3e3e3',
                      borderRadius: 8,
                      padding: '12px 14px',
                      fontWeight: 600,
                      color: '#222',
                      fontSize: 16,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      outline: activeSlideIdx === idx ? '2px solid #1976d2' : 'none',
                      boxShadow: activeSlideIdx === idx ? '0 2px 8px rgba(25,118,210,0.08)' : 'none',
                      marginBottom: 2,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {`슬라이드 ${idx + 1}`}
                  </div>
                ))}
              </div>
            </aside>

            {/* 우측: 편집 영역 */}
            <main style={{ 
              flex: 1, 
              padding: '40px 32px', 
              background: '#f8fafc', 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'flex-start' 
            }}>
              <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 18 
                }}>
                  <span style={{ 
                    color: '#1976d2', 
                    fontWeight: 700, 
                    fontSize: 22 
                  }}>
                    슬라이드 {activeSlideIdx !== null ? activeSlideIdx + 1 : 1}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={undo} 
                      style={{ 
                        background: '#fff', 
                        color: '#1976d2', 
                        border: '1.5px solid #1976d2', 
                        borderRadius: 6, 
                        fontWeight: 600, 
                        fontSize: 15, 
                        padding: '7px 14px', 
                        cursor: 'pointer' 
                      }}
                    >
                      ↩️ Undo
                    </button>
                    <button 
                      onClick={redo} 
                      style={{ 
                        background: '#fff', 
                        color: '#1976d2', 
                        border: '1.5px solid #1976d2', 
                        borderRadius: 6, 
                        fontWeight: 600, 
                        fontSize: 15, 
                        padding: '7px 14px', 
                        cursor: 'pointer' 
                      }}
                    >
                      ↪️ Redo
                    </button>
                  </div>
                </div>
                {activeSlideIdx !== null && (
                  <div style={{ 
                    marginBottom: 18, 
                    display: 'flex', 
                    gap: 8, 
                    justifyContent: 'flex-end' 
                  }}>
                    <button 
                      onClick={() => addNewSlide(activeSlideIdx)} 
                      style={{ 
                        background: '#4caf50', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 6, 
                        fontWeight: 600, 
                        fontSize: 15, 
                        padding: '7px 14px', 
                        cursor: 'pointer' 
                      }}
                    >
                      + 새 슬라이드
                    </button>
                    <button 
                      onClick={() => handleDeleteSlide(activeSlideIdx)} 
                      style={{ 
                        background: '#f44336', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 6, 
                        fontWeight: 600, 
                        fontSize: 15, 
                        padding: '7px 14px', 
                        cursor: 'pointer' 
                      }}
                    >
                      🗑 삭제
                    </button>
                    <button 
                      onClick={() => handleDuplicateSlide(activeSlideIdx)} 
                      style={{ 
                        background: '#9c27b0', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 6, 
                        fontWeight: 600, 
                        fontSize: 15, 
                        padding: '7px 14px', 
                        cursor: 'pointer' 
                      }}
                    >
                      ⧉ 복제
                    </button>
                  </div>
                )}
                {activeSlideIdx !== null && (
                  <div style={{ 
                    background: '#111', 
                    border: '2px solid #1976d2', 
                    borderRadius: 12, 
                    boxShadow: '0 4px 24px rgba(25,118,210,0.15)', 
                    padding: '32px 24px 16px 24px', 
                    minWidth: 320, 
                    maxWidth: 700, 
                    width: '100%', 
                    margin: '0 auto', 
                    position: 'relative', 
                    zIndex: 1 
                  }}>
                    <textarea
                      value={slides[activeSlideIdx]}
                      onChange={(e) => handleSlideChange(activeSlideIdx, e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 200,
                        background: '#000',
                        color: '#fff',
                        border: '1.5px solid #333',
                        borderRadius: 8,
                        fontSize: '1.2rem',
                        lineHeight: 1.7,
                        padding: 18,
                        marginBottom: 10,
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                      placeholder="여기에 내용을 입력하세요..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          e.preventDefault();
                          const cursorPosition = e.target.selectionStart;
                          const textBeforeCursor = e.target.value.substring(0, cursorPosition);
                          const textAfterCursor = e.target.value.substring(cursorPosition);
                          handleSlideChange(activeSlideIdx, textBeforeCursor + '\n(·) ' + textAfterCursor);
                          setTimeout(() => {
                            e.target.selectionStart = cursorPosition + 4;
                            e.target.selectionEnd = cursorPosition + 4;
                          }, 0);
                        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          setEditModes(editModes.map(() => false));
                          setActiveSlideIdx(null);
                        }
                      }}
                      autoFocus
                    />
                    <div style={{ 
                      color: '#90caf9', 
                      fontSize: '0.95rem', 
                      marginTop: 4, 
                      textAlign: 'right' 
                    }}>
                      Shift+Enter: 줄바꿈, Ctrl+Enter: 편집 종료
                    </div>
                  </div>
                )}
                {/* 저장/불러오기/다운로드/프레젠테이션 버튼 */}
                <div style={{ 
                  display: 'flex', 
                  gap: 10, 
                  marginTop: 32, 
                  justifyContent: 'center' 
                }}>
                  <button 
                    onClick={handleSaveSlides} 
                    style={{ 
                      padding: '8px 20px', 
                      fontSize: 16, 
                      background: '#1976d2', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 6, 
                      fontWeight: 500, 
                      cursor: 'pointer' 
                    }}
                  >
                    저장
                  </button>
                  <button 
                    onClick={handleLoadSlides} 
                    style={{ 
                      padding: '8px 20px', 
                      fontSize: 16, 
                      background: '#43a047', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: 6, 
                      fontWeight: 500, 
                      cursor: 'pointer' 
                    }}
                  >
                    불러오기
                  </button>
                  <button 
                    onClick={handleDownloadScript} 
                    style={{ 
                      padding: '8px 20px', 
                      fontSize: 16, 
                      background: '#ffb300', 
                      color: '#222', 
                      border: 'none', 
                      borderRadius: 6, 
                      fontWeight: 500, 
                      cursor: 'pointer' 
                    }}
                  >
                    대본 다운로드
                  </button>
                </div>
                {saveMsg && (
                  <span style={{ 
                    color: '#1976d2', 
                    fontWeight: 500, 
                    marginLeft: 12 
                  }}>
                    {saveMsg}
                  </span>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
      
      {/* 모달들 */}
          <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
          <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
          <CaptionTipModal isOpen={isCaptionTipOpen} onClose={() => setIsCaptionTipOpen(false)} />
          <PresentationMode slides={slides} isOpen={showPresentation} onClose={() => setShowPresentation(false)} />
          <ShortcutHelp />
      
      {/* 에러 모달 */}
      {errorModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#333' }}>
              업로드 오류
            </h3>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
              {errorModal.message}
            </p>
            <button
              onClick={() => setErrorModal({ isOpen: false, message: '', type: '' })}
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

