import { useState } from 'react';

const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="modal-scroll">
          <h1 className="modal-title">대본 전처리 가이드 📝</h1>
          
          <section className="guide-section">
            <h2>시작하기 전에</h2>
            <ul>
              <li>대본 파일은 반드시 <code>.txt</code> 형식이어야 합니다</li>
              <li>한글(<code>.hwp</code>)이나 워드(<code>.docx</code>) 파일은 텍스트(<code>.txt</code>)로 변환해주세요</li>
            </ul>
          </section>

          <section className="guide-section">
            <h2>기본 작성 규칙 ✨</h2>
            
            <div className="rule-box">
              <h3>1. 배역과 대사</h3>
              <div className="code-box">
                <code>(배역명) 대사 내용</code>
                <button className="copy-button" onClick={() => navigator.clipboard.writeText('(배역명) 대사 내용')}>
                  복사
                </button>
              </div>
              <ul>
                <li>배역은 반드시 소괄호 <code>( )</code> 안에 작성해주세요</li>
                <li>예시: <code>(나)</code>, <code>(영희)</code>, <code>(모두)</code></li>
              </ul>
            </div>

            <div className="rule-box">
              <h3>2. 지문과 효과 표시</h3>
              <ul>
                <li>일반 지문: <code>[박수를 친다]</code></li>
                <li>효과음: <code>[♪ 전화벨 소리]</code></li>
                <li>배경음악: <code>[♬ 잔잔한 피아노곡]</code></li>
              </ul>
            </div>

            <div className="rule-box">
              <h3>3. 슬라이드 나누기</h3>
              <ul>
                <li>슬라이드를 구분하려면 <code>---</code> 를 사용해주세요</li>
                <li>반드시 독립된 줄에 작성해주세요</li>
              </ul>
            </div>
          </section>

          <section className="guide-section">
            <h2>작성 예시 💡</h2>
            <div className="example-box">
              <pre>
                <code>
{`(철수) 안녕하세요!
[밝게 웃으며 인사한다]
---
(영희) 네, 안녕하세요.
[♪ 경쾌한 음악]
---
(모두) 오늘도 좋은 하루!
[♬ 즐거운 배경음악]`}
                </code>
              </pre>
              <button className="copy-button" onClick={() => navigator.clipboard.writeText(`(철수) 안녕하세요!\n[밝게 웃으며 인사한다]\n---\n(영희) 네, 안녕하세요.\n[♪ 경쾌한 음악]\n---\n(모두) 오늘도 좋은 하루!\n[♬ 즐거운 배경음악]`)}>
                예시 복사하기
              </button>
            </div>
          </section>

          <section className="guide-section">
            <h2>주의사항 ⚠️</h2>
            <ul>
              <li>괄호와 기호는 정확히 입력해주세요</li>
              <li>배역명과 대사 사이는 띄어쓰기 해주세요</li>
              <li>각 슬라이드는 반드시 <code>---</code>로 구분해주세요</li>
            </ul>
          </section>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          position: relative;
        }

        .modal-scroll {
          max-height: calc(90vh - 4rem);
          overflow-y: auto;
          padding-right: 1rem;
        }

        .close-button {
          position: absolute;
          right: 1rem;
          top: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background-color: #f0f0f0;
        }

        .modal-title {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #1976d2;
        }

        .guide-section {
          margin-bottom: 2rem;
        }

        .guide-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .rule-box {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .rule-box h3 {
          margin-bottom: 1rem;
          color: #2196f3;
        }

        .code-box {
          background: #e3f2fd;
          padding: 1rem;
          border-radius: 6px;
          margin: 1rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .example-box {
          background: #f5f5f5;
          padding: 1.5rem;
          border-radius: 8px;
          position: relative;
        }

        .example-box pre {
          margin: 0;
          white-space: pre-wrap;
        }

        .copy-button {
          background: #2196f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .copy-button:hover {
          background: #1976d2;
        }

        code {
          background: #e3f2fd;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
        }

        ul {
          list-style-type: none;
          padding-left: 0;
        }

        li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .modal-content {
            padding: 1rem;
            width: 95%;
          }

          .modal-title {
            font-size: 1.5rem;
          }

          .guide-section h2 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GuideModal; 