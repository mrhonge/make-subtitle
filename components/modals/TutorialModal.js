import React from 'react';
import Modal from '../atoms/Modal';
import modalStyles from '../atoms/Modal.module.css';

export default function TutorialModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <button
        onClick={onClose}
        className={modalStyles.closeButton}
      >
        ✕
      </button>
      <div className={modalStyles.modalContent}>
        <h2 className={modalStyles.modalTitle}>
          <span style={{ fontSize: '36px' }}>📚</span>
          자막 해설 슬라이드 생성기 사용법
        </h2>
        <section className={modalStyles.modalSection}>
          <h3 className={modalStyles.modalSectionTitle}>
            <span style={{ color: '#64b5f6', fontSize: '20px' }}>01</span>
            시작하기
          </h3>
          <ul className={modalStyles.modalList}>
            <li>'대본 작성 가이드'를 참고하여 올바른 형식으로 공연의 음성 정보를 담은 대본을 텍스트 파일(.txt)로 작성하세요.</li>
            <li>상단의 '파일 선택' 버튼을 통해 대본 파일을 업로드합니다.</li>
          </ul>
        </section>
        <section className={modalStyles.modalSection}>
          <h3 className={modalStyles.modalSectionTitle}>
            <span style={{ color: '#64b5f6', fontSize: '20px' }}>02</span>
            슬라이드 편집
          </h3>
          <ul className={modalStyles.modalList}>
            <li>슬라이드를 클릭하면 편집 모드가 활성화됩니다.</li>
            <li>편집 모드에서는 새 슬라이드 추가, 삭제, 복제 및 텍스트 수정이 가능합니다.</li>
            <li>우측 하단 키보드 모양 이모티콘을 클릭하면 유용한 단축키를 확인하실 수 있습니다.</li>
          </ul>
        </section>
        <section className={modalStyles.modalSection}>
          <h3 className={modalStyles.modalSectionTitle}>
            <span style={{ color: '#64b5f6', fontSize: '20px' }}>03</span>
            저장과 불러오기
          </h3>
          <ul className={modalStyles.modalList}>
            <li>'저장' 버튼: 현재 작업을 브라우저에 저장</li>
            <li>'불러오기' 버튼: 저장된 작업 불러오기</li>
            <li>'대본 다운로드' 버튼: 현재까지의 수정 상황을 텍스트 파일로 다운로드</li>
          </ul>
        </section>
        <section className={modalStyles.modalSection}>
          <h3 className={modalStyles.modalSectionTitle}>
            <span style={{ color: '#64b5f6', fontSize: '20px' }}>05</span>
            프레젠테이션 모드
          </h3>
          <ul className={modalStyles.modalList}>
            <li>"프레젠테이션 시작" 버튼으로 전체 화면 모드 시작</li>
            <li>화살표 키나 스페이스바로 슬라이드 이동</li>
            <li>ESC 키로 프레젠테이션 모드 종료</li>
          </ul>
        </section>
        <div className={modalStyles.modalNotice}>
          <p className={modalStyles.modalNoticeTitle}>
            <span style={{ fontSize: '24px' }}>💡</span> 도움말
          </p>
          <ul className={modalStyles.modalNoticeList}>
            <li>처음 사용하시는 경우, "대본 작성 가이드"를 먼저 확인해보세요!</li>
            <li>문제가 발생하면 페이지를 새로고침한 후 "불러오기"를 통해 작업을 복구할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
} 