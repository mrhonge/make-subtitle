import { useState } from 'react';
import PPTXGenJS from 'pptxgenjs';

export default function Home() {
  const [script, setScript] = useState('');
  const [slides, setSlides] = useState([]);
  const [saveMsg, setSaveMsg] = useState('');

  // .txt 파일 업로드 및 읽기
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setScript(event.target.result);
      setSlides(parseScript(event.target.result));
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
      setSaveMsg('슬라이드를 성공적으로 불러왔습니다!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (e) {
      setSaveMsg('불러오기에 실패했습니다.');
      setTimeout(() => setSaveMsg(''), 2000);
    }
  };

  // PPTX 다운로드 기능 (3.x 문법)
  const handleDownloadPPTX = () => {
    const pptx = new PPTXGenJS();
    pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
    pptx.layout = 'WIDE';
    slides.forEach((slideText) => {
      const slide = pptx.addSlide();
      slide.background = { fill: '000000' };
      slide.addText(slideText, {
        x: 0.5,
        y: 1.5,
        w: 12.33,
        h: 4.5,
        align: 'center',
        fontSize: 28,
        color: 'FFFFFF',
        fontFace: 'Noto Sans KR',
        bold: false,
        valign: 'middle',
        isTextBox: true,
      });
    });
    pptx.writeFile('자막_슬라이드.pptx');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px', fontFamily: 'Noto Sans KR, sans-serif' }}>
      <header style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>자막 해설 슬라이드 생성기</h1>
        <p style={{ color: '#555', fontSize: 18, marginBottom: 0 }}>
          연극/공연 대본(.txt) 파일을 업로드하면 자막 슬라이드를 자동으로 생성하고, 편집 및 PPT로 저장할 수 있습니다.<br />
          <span style={{ color: '#1976d2', fontWeight: 500 }}>
            슬라이드 구분 기호는 <b>---</b>를 사용하세요.
          </span>
        </p>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 24, justifyContent: 'center' }}>
        <input type="file" accept=".txt" onChange={handleFileChange} style={{ fontSize: 16 }} />
        <button onClick={handleSaveSlides} style={{ padding: '8px 20px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
          저장
        </button>
        <button onClick={handleLoadSlides} style={{ padding: '8px 20px', fontSize: 16, background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
          불러오기
        </button>
        <button onClick={handleDownloadPPTX} style={{ padding: '8px 20px', fontSize: 16, background: '#ffb300', color: '#222', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
          PPT로 저장
        </button>
        {saveMsg && <span style={{ color: '#1976d2', fontWeight: 500, marginLeft: 12 }}>{saveMsg}</span>}
      </div>
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>슬라이드 미리보기</h2>
        {slides.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>대본 파일을 업로드하면 슬라이드가 생성됩니다.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {slides.map((slide, idx) => (
            <div key={idx}>
              <div style={{ color: '#1976d2', fontWeight: 600, marginBottom: 8, fontSize: 18 }}>
                슬라이드 {idx + 1}
              </div>
              <div
                style={{
                  background: '#000',
                  color: '#fff',
                  borderRadius: 12,
                  padding: 32,
                  minHeight: 180,
                  fontFamily: 'Noto Sans KR, sans-serif',
                  fontSize: 24,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  marginBottom: 8,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {slide.split('\n').map((line, lineIdx) => {
                  const match = line.match(/^\(([^)]+)\)\s*(.*)$/s);
                  const role = match ? match[1] : '';
                  const content = match ? match[2] : line;
                  return (
                    <div key={lineIdx} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 2 }}>
                      {role && (
                        <span style={{ minWidth: 80, fontWeight: 700 }}>{`(${role})`}</span>
                      )}
                      <span style={{ marginLeft: role ? 24 : 0, whiteSpace: 'pre-line' }}>{content}</span>
                    </div>
                  );
                })}
              </div>
              {idx < slides.length - 1 && (
                <hr style={{ border: 'none', borderTop: '1.5px dashed #bbb', margin: '32px 0 0 0' }} />
              )}
            </div>
          ))}
        </div>
      </section>
      <footer style={{ marginTop: 48, textAlign: 'center', color: '#aaa', fontSize: 15 }}>
        &copy; {new Date().getFullYear()} 자막 해설 슬라이드 생성기
      </footer>
    </div>
  );
}
