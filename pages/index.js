import { useState } from 'react';
import GuideModal from '../components/GuideModal';
import PresentationMode from '../components/PresentationMode';
import ShortcutHelp from '../components/ShortcutHelp';

export default function Home() {
  const [script, setScript] = useState('');
  const [slides, setSlides] = useState([]);
  const [saveMsg, setSaveMsg] = useState('');
  const [editModes, setEditModes] = useState([]); // 각 슬라이드의 편집 모드 상태 관리
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  
  // 편집 히스토리 관리
  const [history, setHistory] = useState([]); // 각 슬라이드의 편집 히스토리
  const [historyIndex, setHistoryIndex] = useState(-1); // 현재 히스토리 위치
  const [activeSlideIdx, setActiveSlideIdx] = useState(null); // 현재 편집 중인 슬라이드 인덱스

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

  // .txt 파일 업로드 및 읽기
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setScript(event.target.result);
      const newSlides = parseScript(event.target.result);
      setSlides(newSlides);
      setEditModes(new Array(newSlides.length).fill(false)); // 편집 모드 초기화
      // 히스토리 초기화
      setHistory([{ slides: newSlides, activeSlide: null }]);
      setHistoryIndex(0);
      setActiveSlideIdx(null);
    };
    reader.readAsText(file, 'utf-8');
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
      // 각 요소가 문자열이 아닐 경우 문자열로 변환
      loadedSlides = loadedSlides.map(slide => typeof slide === 'string' ? slide : JSON.stringify(slide));
      setSlides(loadedSlides);
      setEditModes(new Array(loadedSlides.length).fill(false)); // 편집 모드 초기화
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
    newSlides.splice(idx + 1, 0, ''); // 현재 슬라이드 다음에 빈 슬라이드 추가
    setSlides(newSlides);
    
    const newEditModes = [...editModes];
    newEditModes.splice(idx + 1, 0, true); // 새 슬라이드는 편집 모드로 시작
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

  // 슬라이드 내용 변경 시 히스토리 추가
  const handleSlideChange = (idx, newContent) => {
    const newSlides = [...slides];
    newSlides[idx] = newContent;
    setSlides(newSlides);
    addToHistory(newSlides);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px', fontFamily: 'Noto Sans KR, sans-serif' }}>
      <header style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>자막 해설 슬라이드 생성기</h1>
        <p style={{ color: '#555', fontSize: 18, marginBottom: 16 }}>
          연극/공연 대본(.txt) 파일을 업로드하면 자막 슬라이드를 자동으로 생성하고, 편집할 수 있습니다.
        </p>
        <button 
          onClick={() => setIsGuideOpen(true)}
          style={{
            background: '#e3f2fd',
            color: '#1976d2',
            border: 'none',
            padding: '8px 20px',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: 24,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={e => e.target.style.background = '#bbdefb'}
          onMouseOut={e => e.target.style.background = '#e3f2fd'}
        >
          📝 대본 작성 가이드 보기
        </button>
      </header>

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <PresentationMode 
        slides={slides} 
        isOpen={showPresentation} 
        onClose={() => setShowPresentation(false)} 
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 24, justifyContent: 'center' }}>
        <input type="file" accept=".txt" onChange={handleFileChange} style={{ fontSize: 16 }} />
        <button onClick={handleSaveSlides} style={{ padding: '8px 20px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
          저장
        </button>
        <button onClick={handleLoadSlides} style={{ padding: '8px 20px', fontSize: 16, background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
          불러오기
        </button>
        <button onClick={handleDownloadScript} style={{ padding: '8px 20px', fontSize: 16, background: '#ffb300', color: '#222', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
          대본 다운로드
        </button>
        {slides.length > 0 && (
          <button 
            onClick={() => setShowPresentation(true)}
            style={{ 
              padding: '8px 20px', 
              fontSize: 16, 
              background: '#9c27b0', 
              color: '#fff', 
              border: 'none', 
              borderRadius: 6, 
              fontWeight: 500, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ▶️ 프레젠테이션 시작
          </button>
        )}
        {saveMsg && <span style={{ color: '#1976d2', fontWeight: 500, marginLeft: 12 }}>{saveMsg}</span>}
      </div>
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>슬라이드 미리보기</h2>
        {slides.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>대본 파일을 업로드하면 슬라이드가 생성됩니다.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {slides.map((slide, idx) => (
            <div key={idx}>
              <div style={{ 
                color: '#1976d2', 
                fontWeight: 600, 
                marginBottom: 8, 
                fontSize: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>슬라이드 {idx + 1}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => addNewSlide(idx)}
                    style={{
                      padding: '4px 12px',
                      fontSize: 14,
                      background: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span style={{ fontSize: 18, marginBottom: 2 }}>+</span>
                    새 슬라이드
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(idx)}
                    style={{
                      padding: '4px 12px',
                      fontSize: 14,
                      background: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div
                style={{
                  background: '#000',
                  color: '#fff',
                  padding: 24,
                  borderRadius: 8,
                  whiteSpace: 'pre-wrap',
                  fontSize: 18,
                  lineHeight: 1.6,
                  position: 'relative'
                }}
              >
                {editModes[idx] ? (
                  <textarea
                    value={slide}
                    onChange={(e) => handleSlideChange(idx, e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 200,
                      background: '#000',
                      color: '#fff',
                      border: '1px solid #333',
                      padding: 16,
                      borderRadius: 4,
                      fontSize: 18,
                      lineHeight: 1.6,
                      fontFamily: 'inherit'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.shiftKey) {
                        e.preventDefault();
                        const cursorPosition = e.target.selectionStart;
                        const textBeforeCursor = e.target.value.substring(0, cursorPosition);
                        const textAfterCursor = e.target.value.substring(cursorPosition);
                        handleSlideChange(idx, textBeforeCursor + '\n(·) ' + textAfterCursor);
                        // 다음 렌더링 후 커서 위치 조정
                        setTimeout(() => {
                          e.target.selectionStart = cursorPosition + 4;
                          e.target.selectionEnd = cursorPosition + 4;
                        }, 0);
                      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        toggleEditMode(idx);
                      }
                    }}
                  />
                ) : (
                  <div
                    onClick={() => toggleEditMode(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    {slide.split('\n').map((line, lineIdx) => {
                      if (line.startsWith('(·)')) {
                        // 들여쓰기된 대사 처리
                        const content = line.slice(4);
                        return (
                          <div key={lineIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div style={{ flex: '0 0 160px', visibility: 'hidden' }}>(·)</div>
                            <div style={{ flex: 1 }}>{content}</div>
                          </div>
                        );
                      }

                      const roleMatch = line.match(/^\(([^)]+)\)\s*(.*)$/s);
                      const effectMatch = line.match(/^\[(♪|♬)?\s*([^\]]+)\]$/s);

                      if (roleMatch) {
                        return (
                          <div key={lineIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div style={{ flex: '0 0 160px', fontWeight: 600 }}>({roleMatch[1]})</div>
                            <div style={{ flex: 1 }}>{roleMatch[2]}</div>
                          </div>
                        );
                      } else if (effectMatch) {
                        return (
                          <div key={lineIdx} style={{ 
                            color: effectMatch[1] ? '#ffb300' : '#4caf50',
                            marginBottom: 8,
                            fontStyle: 'italic'
                          }}>
                            [{effectMatch[1] || ''}{effectMatch[2]}]
                          </div>
                        );
                      } else {
                        return <div key={lineIdx} style={{ marginBottom: 8 }}>{line}</div>;
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <ShortcutHelp />
    </div>
  );
}

