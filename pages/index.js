import { useState } from 'react';
import GuideModal from '../components/modals/GuideModal';
import PresentationMode from '../components/organisms/PresentationMode';
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
  
  // 검색 기능
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // 단축키 도움말
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);
  
  // 상단 이동 기능
  const scrollToTop = () => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

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

  // 슬라이드 미리보기 텍스트 추출 함수
  const getSlidePreview = (slideContent) => {
    if (!slideContent || slideContent.trim() === '') {
      return '내용 없음';
    }
    
    // 첫 번째 줄을 가져와서 미리보기로 사용
    const firstLine = slideContent.split('\n')[0].trim();
    
    // 너무 긴 경우 잘라내기 (35자 제한)
    if (firstLine.length > 35) {
      return firstLine.substring(0, 35) + '...';
    }
    
    return firstLine || '내용 없음';
  };

  // 검색 기능
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = slides
      .map((slide, index) => ({ slide, index }))
      .filter(({ slide }) => 
        slide.toLowerCase().includes(query.toLowerCase())
      );
    
    setSearchResults(results);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const goToSlide = (slideIndex) => {
    setEditModes(editModes.map((_, i) => i === slideIndex));
    setActiveSlideIdx(slideIndex);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

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

            {/* 자막 제작 팁 안내 텍스트 */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '40px',
              padding: '20px'
            }}>
              <p 
                onClick={() => setIsCaptionTipOpen(true)}
                style={{
                  fontSize: '16px',
                  color: '#1976d2',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: '500',
                  margin: 0,
                  transition: 'all 0.2s ease',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e3f2fd';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                💡 자막 제작용 대본을 작성할 때 주의해야 할 사항이 있나요?
              </p>
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
          <div style={{
            display: 'flex', 
            flexDirection: 'row', 
            maxWidth: 1400, 
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
              padding: '16px 16px 32px 16px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
            }}>
              {/* 상단 버튼들 */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
                alignSelf: 'flex-start'
              }}>
                {/* 홈 버튼 */}
                <button
                  onClick={() => {
                    // 홈으로 이동하기 위해 슬라이드를 초기화
                    setSlides([]);
                    setScript('');
                    setEditModes([]);
                    setActiveSlideIdx(null);
                    setHistory([]);
                    setHistoryIndex(-1);
                  }}
                  style={{
                    background: '#f5f5f5',
                    border: '1.5px solid #ddd',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    transition: 'all 0.2s ease',
                    color: '#666'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#1976d2';
                    e.target.style.color = '#fff';
                    e.target.style.borderColor = '#1976d2';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f5f5f5';
                    e.target.style.color = '#666';
                    e.target.style.borderColor = '#ddd';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  title="홈으로 돌아가기"
                >
                  🏠
                </button>

                {/* 검색 버튼 */}
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  style={{
                    background: isSearchOpen ? '#1976d2' : '#f5f5f5',
                    border: `1.5px solid ${isSearchOpen ? '#1976d2' : '#ddd'}`,
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    transition: 'all 0.2s ease',
                    color: isSearchOpen ? '#fff' : '#666'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSearchOpen) {
                      e.target.style.background = '#1976d2';
                      e.target.style.color = '#fff';
                      e.target.style.borderColor = '#1976d2';
                    }
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSearchOpen) {
                      e.target.style.background = '#f5f5f5';
                      e.target.style.color = '#666';
                      e.target.style.borderColor = '#ddd';
                    }
                    e.target.style.transform = 'translateY(0)';
                  }}
                  title="슬라이드 검색"
                >
                  🔍
                </button>
              </div>

              {/* 검색 영역 */}
              {isSearchOpen && (
                <div style={{
                  width: '100%',
                  marginBottom: '16px',
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e3e3e3'
                }}>
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                      }}
                      placeholder="대사 내용 검색..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1.5px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                      onBlur={(e) => e.target.style.borderColor = '#ddd'}
                      autoFocus
                    />
                  </form>
                  
                  {/* 검색 결과 */}
                  {searchQuery && (
                    <div style={{ marginTop: '8px' }}>
                      {searchResults.length > 0 ? (
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          {searchResults.length}개 결과 발견
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          검색 결과가 없습니다
                        </div>
                      )}
                      
                      {searchResults.map(({ slide, index }) => (
                        <div
                          key={index}
                          onClick={() => goToSlide(index)}
                          style={{
                            padding: '8px',
                            background: '#fff',
                            border: '1px solid #e3e3e3',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#e3f2fd';
                            e.target.style.borderColor = '#1976d2';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.borderColor = '#e3e3e3';
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#1976d2', marginBottom: '2px' }}>
                            슬라이드 {index + 1}
                          </div>
                          <div style={{ 
                            color: '#666',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3
                          }}>
                            {slide}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 슬라이드 목록 제목 */}
              <h2 style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                color: '#1976d2', 
                marginBottom: 18,
                alignSelf: 'center',
                width: '100%',
                textAlign: 'center'
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
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      outline: activeSlideIdx === idx ? '2px solid #1976d2' : 'none',
                      boxShadow: activeSlideIdx === idx ? '0 2px 8px rgba(25,118,210,0.08)' : 'none',
                      marginBottom: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 4
                    }}
                  >
                    <div style={{
                      fontWeight: 700,
                      color: activeSlideIdx === idx ? '#1976d2' : '#333',
                      fontSize: 14,
                      lineHeight: 1.2
                    }}>
                      슬라이드 {idx + 1}
                    </div>
                    <div style={{
                      fontWeight: 400,
                      color: activeSlideIdx === idx ? '#555' : '#666',
                      fontSize: 12,
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      textOverflow: 'ellipsis',
                      width: '100%',
                      wordBreak: 'break-word'
                    }}>
                      {getSlidePreview(slide)}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* 중앙: 편집 영역 */}
            <main style={{ 
              flex: 1, 
              padding: '20px', 
              background: '#f8fafc', 
              minHeight: '100vh', 
              overflow: 'auto',
              position: 'relative'
            }}>
              {/* 편집 안내 노티스 */}
              <div style={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%)',
                border: '2px solid #1976d2',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
              }}>
                <span style={{
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  💡
                </span>
                <div style={{
                  flex: 1
                }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1976d2',
                    lineHeight: 1.4
                  }}>
                    슬라이드 편집하기
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#555',
                    lineHeight: 1.5
                  }}>
                    아래 슬라이드를 <strong>클릭</strong>하면 편집 모드로 전환됩니다. 편집이 완료되면 다른 곳을 클릭하여 편집을 종료하세요.
                  </p>
                </div>
                <span style={{
                  fontSize: '20px',
                  color: '#1976d2',
                  flexShrink: 0
                }}>
                  👆
                </span>
              </div>

              {/* 슬라이드 리스트 컴포넌트 */}
              <SlideList
                slides={slides}
                editModes={editModes}
                activeSlideIdx={activeSlideIdx}
                onSlideClick={toggleEditMode}
                renderEditArea={(idx, slide) => (
                  <div style={{ marginTop: 16 }}>
                    {/* 편집 모드에서만 보이는 액션 버튼들 - 상단에 분리된 영역 */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                      gap: 8
                    }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          onClick={undo}
                          style={{ 
                            background: '#fff', 
                            color: '#1976d2', 
                            border: '1.5px solid #1976d2', 
                            borderRadius: 6, 
                            fontWeight: 600, 
                            fontSize: 13, 
                            padding: '6px 12px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                          onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
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
                            fontSize: 13, 
                            padding: '6px 12px', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                          onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                        >
                          ↪️ Redo
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addNewSlide(idx);
                          }}
                          style={{ 
                            background: '#4caf50', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            fontWeight: 600, 
                            fontSize: 13, 
                            padding: '6px 12px', 
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          + 새 슬라이드
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(idx);
                          }}
                          style={{ 
                            background: '#f44336', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            fontWeight: 600, 
                            fontSize: 13, 
                            padding: '6px 12px', 
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          🗑 삭제
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateSlide(idx);
                          }}
                          style={{ 
                            background: '#9c27b0', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: 6, 
                            fontWeight: 600, 
                            fontSize: 13, 
                            padding: '6px 12px', 
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          ⧉ 복제
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={slide}
                      onChange={(e) => handleSlideChange(idx, e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 180,
                        background: '#000',
                        color: '#fff',
                        border: '2px solid #1976d2',
                        borderRadius: 8,
                        fontSize: '1.2rem',
                        lineHeight: 1.7,
                        padding: 12,
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
                          handleSlideChange(idx, textBeforeCursor + '\n(·) ' + textAfterCursor);
                          setTimeout(() => {
                            e.target.selectionStart = cursorPosition + 4;
                            e.target.selectionEnd = cursorPosition + 4;
                          }, 0);
                        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          setEditModes(editModes.map(() => false));
                          setActiveSlideIdx(null);
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                      autoFocus
                    />
                    <div style={{ 
                      color: '#90caf9', 
                      fontSize: '0.95rem', 
                      marginBottom: 10,
                      textAlign: 'right' 
                    }}>
                      Shift+Enter: 줄바꿈, Ctrl+Enter: 편집 종료
                    </div>
                  </div>
                )}
              />
              
              {/* 상단 이동 버튼 */}
              <button
                onClick={scrollToTop}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '30px',
                  width: '50px',
                  height: '50px',
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease',
                  zIndex: 100
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
                }}
                title="맨 위로 이동"
              >
                ▲
              </button>
            </main>

            {/* 우측: 액션 사이드바 */}
            <aside style={{
              width: 220,
              minWidth: 200,
              maxWidth: 250,
              background: '#fff',
              borderLeft: '1.5px solid #e3e3e3',
              padding: '32px 16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>


              {/* 프레젠테이션 시작 버튼 - 가장 중요 */}
              <button
                onClick={() => setShowPresentation(true)}
                style={{
                  padding: '16px 20px',
                  fontSize: 14,
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(25,118,210,0.25)'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                <span style={{ fontSize: 18 }}>▶️</span>
                프레젠테이션 시작
              </button>

              {/* 구분선 */}
              <div style={{
                height: 1,
                background: '#e3e3e3',
                margin: '8px 0'
              }} />

              {/* 기타 액션 버튼들 */}
              <button
                onClick={handleSaveSlides}
                style={{
                  padding: '12px 16px',
                  fontSize: 14,
                  background: '#42a5f5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                💾 저장
              </button>

              <button
                onClick={() => document.getElementById('sidebar-file-upload').click()}
                style={{
                  padding: '12px 16px',
                  fontSize: 14,
                  background: '#42a5f5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                📂 새 대본 불러오기
              </button>
              
              {/* 숨겨진 파일 입력 요소 */}
              <input 
                id="sidebar-file-upload" 
                type="file" 
                accept=".txt" 
                style={{ display: 'none' }} 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    processFile(file);
                    // 파일 입력 초기화
                    e.target.value = '';
                  }
                }} 
              />

              <button
                onClick={handleDownloadScript}
                style={{
                  padding: '12px 16px',
                  fontSize: 14,
                  background: '#42a5f5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                📄 대본 다운로드
              </button>

              {/* 하단 구분선 */}
              <div style={{
                height: 1,
                background: '#e3e3e3',
                margin: '16px 0 8px 0'
              }} />

              {/* 튜토리얼 버튼 */}
              <button
                onClick={() => setIsTutorialOpen(true)}
                style={{
                  padding: '10px 16px',
                  fontSize: 14,
                  background: '#90caf9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                📚 튜토리얼
              </button>

              {/* 단축키 도움말 버튼 */}
              <button
                onClick={() => setIsShortcutHelpOpen(true)}
                style={{
                  padding: '10px 16px',
                  fontSize: 14,
                  background: '#90caf9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
              >
                ⌨️ 단축키
              </button>
            </aside>
          </div>
        </div>
      )}
      
      {/* 토스트 알림 - 화면 중앙 하단 */}
      {saveMsg && (
        <div style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(25, 118, 210, 0.9)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 8,
          fontSize: '16px',
          fontWeight: 500,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          animation: 'fadeInUp 0.3s ease-out',
          backdropFilter: 'blur(10px)'
        }}>
          {saveMsg}
        </div>
      )}
      
      {/* 토스트 애니메이션 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
      
      {/* 모달들 */}
          <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
          <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
          <CaptionTipModal isOpen={isCaptionTipOpen} onClose={() => setIsCaptionTipOpen(false)} />
          <PresentationMode slides={slides} isOpen={showPresentation} onClose={() => setShowPresentation(false)} />
          
          {/* 단축키 도움말 모달 */}
          {isShortcutHelpOpen && (
            <>
              {/* 배경 오버레이 */}
              <div
                onClick={() => setIsShortcutHelpOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000
                }}
              />
              {/* 모달 내용 */}
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '90%',
                zIndex: 1001,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
              }}>
                <button
                  onClick={() => setIsShortcutHelpOpen(false)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '16px',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1976d2',
                  marginBottom: '24px',
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
                  {[
                    { key: 'Shift + Enter', desc: '들여쓰기된 새 줄 추가' },
                    { key: 'Ctrl/Cmd + Z', desc: '실행 취소' },
                    { key: 'Ctrl/Cmd + Y', desc: '다시 실행' },
                    { key: 'Ctrl/Cmd + Enter', desc: '편집 모드 종료' },
                    { key: 'Ctrl/Cmd + Shift + A', desc: '새 슬라이드 추가' },
                    { key: 'Delete', desc: '빈 슬라이드 삭제' }
                  ].map((shortcut, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <span style={{
                        background: '#1976d2',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'monospace'
                      }}>
                        {shortcut.key}
                      </span>
                      <span style={{
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {shortcut.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
      
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

