import React from 'react';
import Modal from '../atoms/Modal';
import modalStyles from '../atoms/Modal.module.css';

export default function TutorialModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <button
        onClick={onClose}
        className={modalStyles.closeButton}
        style={{ 
          background: '#f5f5f5',
          color: '#666',
          fontSize: '20px',
          fontWeight: '600'
        }}
      >
        ✕
      </button>
      
      <div className={modalStyles.modalContent}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '800', 
            color: '#1976d2',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            📚 자막 해설 슬라이드 생성기 사용법
          </h2>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            margin: '0',
            fontWeight: '500'
          }}>
            단계별로 따라하면 누구나 쉽게 자막 슬라이드를 만들 수 있어요
          </p>
        </div>

        {/* 단계별 가이드 */}
        <div style={{ marginBottom: '32px' }}>
          {/* 01. 시작하기 */}
          <div style={{
            border: '2px solid #e3f2fd',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fafbff 0%, #f8f9fa 100%)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#333',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ 
                background: '#1976d2', 
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                01
              </span>
              시작하기
            </h3>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.7',
              fontSize: '15px'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>'대본 작성 가이드'</strong>를 참고하여 올바른 형식으로 공연의 음성 정보를 담은 대본을 텍스트 파일(.txt)로 작성하세요.
              </li>
              <li>
                우측 사이드바의 <strong>'새 대본 불러오기'</strong> 버튼을 통해 대본 파일을 업로드합니다.
              </li>
            </ul>
          </div>

          {/* 02. 슬라이드 편집 */}
          <div style={{
            border: '2px solid #e8f5e8',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#333',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ 
                background: '#43a047', 
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                02
              </span>
              슬라이드 편집
            </h3>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.7',
              fontSize: '15px'
            }}>
              <li style={{ marginBottom: '8px' }}>
                중앙 영역의 <strong>슬라이드를 클릭</strong>하면 편집 모드가 활성화됩니다.
              </li>
              <li style={{ marginBottom: '8px' }}>
                편집 모드에서는 <strong>새 슬라이드 추가, 삭제, 복제 및 텍스트 수정</strong>이 가능합니다.
              </li>
              <li>
                우측 하단 <strong>키보드 모양 이모티콘(⌨️)</strong>을 클릭하면 유용한 단축키를 확인하실 수 있습니다.
              </li>
            </ul>
          </div>

          {/* 03. 저장과 불러오기 */}
          <div style={{
            border: '2px solid #fff3e0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff8e1 0%, #ffffff 100%)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#333',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ 
                background: '#ff9800', 
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                03
              </span>
              저장과 관리
            </h3>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.7',
              fontSize: '15px'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>'저장' 버튼:</strong> 현재 작업을 브라우저에 저장
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>'새 대본 불러오기' 버튼:</strong> 새로운 텍스트 파일 업로드
              </li>
              <li>
                <strong>'대본 다운로드' 버튼:</strong> 현재까지의 수정 상황을 텍스트 파일로 다운로드
              </li>
            </ul>
          </div>

          {/* 04. 프레젠테이션 모드 */}
          <div style={{
            border: '2px solid #f3e5f5',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fce4ec 0%, #ffffff 100%)',
            transition: 'all 0.3s ease'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#333',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ 
                background: '#9c27b0', 
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                04
              </span>
              프레젠테이션 모드
            </h3>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.7',
              fontSize: '15px'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>"프레젠테이션 시작"</strong> 버튼으로 전체 화면 모드 시작
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>화살표 키</strong>나 <strong>스페이스바</strong>로 슬라이드 이동
              </li>
              <li>
                <strong>ESC 키</strong>로 프레젠테이션 모드 종료
              </li>
            </ul>
          </div>
        </div>

        {/* 도움말 */}
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)',
          border: '2px solid #4caf50',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#333',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💡 도움말
          </h3>
          <ul style={{ 
            margin: '0',
            paddingLeft: '20px',
            color: '#333',
            lineHeight: '1.7',
            fontSize: '15px'
          }}>
            <li style={{ marginBottom: '8px' }}>
              처음 사용하시는 경우, <strong>"대본 작성 가이드"</strong>를 먼저 확인해보세요!
            </li>
            <li>
              문제가 발생하면 페이지를 새로고침한 후 <strong>"저장된 작업 불러오기"</strong>를 통해 작업을 복구할 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
} 