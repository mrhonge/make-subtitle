import React from 'react';

export default function CaptionTipModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
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
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '85vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
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
            transition: 'background-color 0.2s'
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
          <span style={{ fontSize: '36px' }}>✨</span>
          자막 제작 Tip!
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
              기본 원칙
            </h3>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '24px' 
            }}>
              <p style={{ marginBottom: '8px', color: '#1976d2', fontWeight: 500 }}>
                💡 모든 청각 정보는 텍스트로 변환하여 제공해야 합니다
              </p>
              <ul style={{ paddingLeft: '20px', color: '#555' }}>
                <li style={{ marginBottom: '8px' }}>대사뿐만 아니라 중요한 소리 효과도 포함</li>
                <li style={{ marginBottom: '8px' }}>음악, 감정 표현도 자막으로 제공</li>
                <li style={{ marginBottom: '8px' }}>화자를 명확히 구분하여 표시</li>
                <li>시각적 명확성과 가독성 중시</li>
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
              <span style={{ color: '#64b5f6', fontSize: '20px' }}>02</span>
              소리 효과 표현하기
            </h3>
            <div style={{ paddingLeft: '28px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>🔊 환경음</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[문이 쾅 하고 닫힌다]</code></p>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[빠른 발자국 소리가 멀어진다]</code></p>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>🎵 음악</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[♪ 긴장감 있는 바이올린 선율]</code></p>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[♬ 경쾌한 재즈]</code></p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>🔉 배경음</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[비 내리는 소리가 점점 커진다]</code></p>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[멀리서 천둥소리]</code></p>
              </div>
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
              감정과 어조 표현하기
            </h3>
            <div style={{ paddingLeft: '28px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>😊 감정 상태</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(울먹이며)</code> <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(웃으며)</code></p>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(화난 목소리로)</code> <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(기쁘게)</code></p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>🗣️ 말하는 방식</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(속삭이며)</code> <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(소리치며)</code></p>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(빠르게)</code> <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(천천히)</code></p>
              </div>
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
              특별한 상황 처리하기
            </h3>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px' 
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>👥 여러 사람이 동시에 말할 때</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(모두 함께)</code> <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(관중들)</code></p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>🔇 침묵 표현</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[긴 침묵]</code> <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[정적]</code></p>
              </div>

              <div>
                <h4 style={{ fontSize: '17px', color: '#2196f3', marginBottom: '12px' }}>📱 전자기기 소리</h4>
                <p style={{ marginBottom: '8px' }}>• <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[TV에서]</code> <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[전화벨 소리]</code></p>
              </div>
            </div>
          </section>

          <div style={{ 
            marginTop: '40px', 
            padding: '24px', 
            background: '#e3f2fd', 
            borderRadius: '12px',
            color: '#1976d2'
          }}>
            <p style={{ fontWeight: 600, fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>💡</span> 가독성을 위한 핵심 팁
            </p>
            <ul style={{ color: '#2196f3', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '8px' }}>한 슬라이드에 너무 많은 내용을 넣지 않습니다.</li>
              <li style={{ marginBottom: '8px' }}>중요한 소리 정보는 대사와 구분되도록 [대괄호]로 표시합니다.</li>
              <li style={{ marginBottom: '8px' }}>배경음악이 계속될 경우 ♪ 기호를 사용합니다.</li>
              <li>동시에 들리는 소리는 우선순위를 정해 순차적으로 표시합니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 