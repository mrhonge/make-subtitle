import React from 'react';

export default function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        fontFamily: 'Noto Sans KR, sans-serif'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '85vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            transition: 'background-color 0.2s',
            fontFamily: 'Noto Sans KR, sans-serif',
            fontWeight: 400
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
        >
          ✕
        </button>
        <h2 style={{
          fontSize: '32px',
          marginBottom: '32px',
          color: '#1976d2',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '36px' }}>📝</span>
          대본 작성 가이드
        </h2>
        <div style={{ fontSize: '16px', lineHeight: '1.7', color: '#333' }}>
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '22px',
              color: '#1976d2',
              marginBottom: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#64b5f6', fontSize: '20px' }}>01</span>
              시작하기 전에
            </h3>
            <ul style={{ paddingLeft: '28px', color: '#555' }}>
              <li style={{ marginBottom: '8px' }}>대본 파일은 반드시 <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>.txt</code> 형식이어야 합니다</li>
              <li>한글(<code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>.hwp</code>)이나 워드(<code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>.docx</code>) 파일은 텍스트(<code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>.txt</code>)로 변환해주세요</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '22px',
              color: '#1976d2',
              marginBottom: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#64b5f6', fontSize: '20px' }}>02</span>
              기본 작성 규칙
            </h3>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ color: '#2196f3', marginBottom: '10px', fontSize: '18px' }}>1. 배역과 대사</h4>
              <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '6px', margin: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontFamily: 'monospace', fontSize: '15px', background: 'none', padding: 0 }}>(배역명) 대사 내용</code>
                <button style={{ background: '#2196f3', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem', transition: 'background-color 0.2s' }} onClick={() => navigator.clipboard.writeText('(배역명) 대사 내용')}>복사</button>
              </div>
              <ul style={{ paddingLeft: '20px', color: '#555' }}>
                <li style={{ marginBottom: '8px' }}>배역은 반드시 소괄호 <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>( )</code> 안에 작성해주세요</li>
                <li>예시: <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>(나)</code>, <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>(영희)</code>, <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>(모두)</code></li>
              </ul>
            </div>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ color: '#2196f3', marginBottom: '10px', fontSize: '18px' }}>2. 지문과 효과 표시</h4>
              <ul style={{ paddingLeft: '20px', color: '#555' }}>
                <li style={{ marginBottom: '8px' }}>일반 지문: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[박수를 친다]</code></li>
                <li style={{ marginBottom: '8px' }}>효과음: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[♪ 전화벨 소리]</code></li>
                <li>배경음악: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[♬ 잔잔한 피아노곡]</code></li>
              </ul>
            </div>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ color: '#2196f3', marginBottom: '10px', fontSize: '18px' }}>3. 슬라이드 나누기</h4>
              <ul style={{ paddingLeft: '20px', color: '#555' }}>
                <li style={{ marginBottom: '8px' }}>슬라이드를 구분하려면 <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>---</code> 를 사용해주세요</li>
                <li>반드시 독립된 줄에 작성해주세요</li>
              </ul>
            </div>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '22px',
              color: '#1976d2',
              marginBottom: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#64b5f6', fontSize: '20px' }}>03</span>
              작성 예시
            </h3>
            <div style={{ background: '#f5f5f5', padding: '24px', borderRadius: '8px', position: 'relative' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '15px' }}>
{`(철수) 안녕하세요!
[밝게 웃으며 인사한다]
---
(영희) 네, 안녕하세요.
[♪ 경쾌한 음악]
---
(모두) 오늘도 좋은 하루!
[♬ 즐거운 배경음악]`}
              </pre>
              <button style={{ position: 'absolute', top: '18px', right: '18px', background: '#2196f3', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem', transition: 'background-color 0.2s' }} onClick={() => navigator.clipboard.writeText(`(철수) 안녕하세요!\n[밝게 웃으며 인사한다]\n---\n(영희) 네, 안녕하세요.\n[♪ 경쾌한 음악]\n---\n(모두) 오늘도 좋은 하루!\n[♬ 즐거운 배경음악]`)}>
                예시 복사하기
              </button>
            </div>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '22px',
              color: '#1976d2',
              marginBottom: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#64b5f6', fontSize: '20px' }}>04</span>
              주의사항
            </h3>
            <ul style={{ paddingLeft: '28px', color: '#555' }}>
              <li style={{ marginBottom: '8px' }}>괄호와 기호는 정확히 입력해주세요</li>
              <li style={{ marginBottom: '8px' }}>배역명과 대사 사이는 띄어쓰기 해주세요</li>
              <li>각 슬라이드는 반드시 <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '4px' }}>---</code>로 구분해주세요</li>
            </ul>
          </section>

          <div style={{
            marginTop: '40px',
            padding: '24px',
            background: '#e3f2fd',
            borderRadius: '12px',
            color: '#1976d2'
          }}>
            <p style={{ fontWeight: 600, fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>💡</span> 도움말
            </p>
            <p style={{ marginBottom: '8px', color: '#2196f3' }}>• 대본 작성 규칙을 지키면 자막 슬라이드가 더 정확하게 생성됩니다.</p>
            <p style={{ color: '#2196f3' }}>• 궁금한 점이 있으면 언제든 도움말을 참고하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 