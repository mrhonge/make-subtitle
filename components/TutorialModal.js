import React from 'react';

export default function TutorialModal({ isOpen, onClose }) {
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
          <span style={{ fontSize: '36px' }}>📚</span>
          자막 해설 슬라이드 생성기 사용법
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
              시작하기
            </h3>
            <div style={{ paddingLeft: '28px' }}>
              <p style={{ marginBottom: '8px' }}>• 상단의 "파일 선택" 버튼을 통해 대본 파일(.txt)을 업로드합니다.</p>
              <p style={{ marginBottom: '8px' }}>• 대본은 "---" 구분선으로 각 슬라이드를 구분합니다.</p>
              <p style={{ marginBottom: '8px' }}>• "대본 작성 가이드"를 참고하여 올바른 형식으로 대본을 작성하세요.</p>
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
              슬라이드 편집
            </h3>
            <div style={{ paddingLeft: '28px' }}>
              <p style={{ marginBottom: '8px' }}>• 슬라이드를 클릭하면 편집 모드가 활성화됩니다.</p>
              <p style={{ marginBottom: '8px' }}>• 편집 모드에서는 새 슬라이드 추가, 삭제, 복제가 가능합니다.</p>
              <p style={{ marginBottom: '8px' }}>• Shift + Enter: 들여쓰기된 설명 추가 (자동으로 "(·)" 입력)</p>
              <p style={{ marginBottom: '8px' }}>• Ctrl/Cmd + Enter: 편집 모드 종료</p>
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
              텍스트 형식
            </h3>
            <div style={{ paddingLeft: '28px' }}>
              <p style={{ marginBottom: '8px' }}>• 배역 대사: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(배역명) 대사내용</code></p>
              <p style={{ marginBottom: '8px' }}>• 효과음: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[효과음 내용]</code></p>
              <p style={{ marginBottom: '8px' }}>• 음악: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[♪ 음악 내용]</code> 또는 <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>[♬ 음악 내용]</code></p>
              <p style={{ marginBottom: '8px' }}>• 추가 설명: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>(·) 설명내용</code></p>
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
              저장과 불러오기
            </h3>
            <div style={{ paddingLeft: '28px' }}>
              <p style={{ marginBottom: '8px' }}>• "저장" 버튼: 현재 작업을 브라우저에 저장</p>
              <p style={{ marginBottom: '8px' }}>• "불러오기" 버튼: 저장된 작업 불러오기</p>
              <p style={{ marginBottom: '8px' }}>• "대본 다운로드" 버튼: 현재 슬라이드를 텍스트 파일로 다운로드</p>
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
              <span style={{ color: '#64b5f6', fontSize: '20px' }}>05</span>
              프레젠테이션 모드
            </h3>
            <div style={{ paddingLeft: '28px' }}>
              <p style={{ marginBottom: '8px' }}>• "프레젠테이션 시작" 버튼으로 전체 화면 모드 시작</p>
              <p style={{ marginBottom: '8px' }}>• 화살표 키나 스페이스바로 슬라이드 이동</p>
              <p style={{ marginBottom: '8px' }}>• ESC 키로 프레젠테이션 모드 종료</p>
            </div>
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
            <p style={{ marginBottom: '8px', color: '#2196f3' }}>• 처음 사용하시는 경우, "대본 작성 가이드"를 먼저 확인해보세요!</p>
            <p style={{ color: '#2196f3' }}>• 문제가 발생하면 페이지를 새로고침한 후 "불러오기"를 통해 작업을 복구할 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 