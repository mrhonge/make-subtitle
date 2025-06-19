import React from 'react';
import Modal from '../atoms/Modal';
import modalStyles from '../atoms/Modal.module.css';

export default function CaptionTipModal({ isOpen, onClose }) {
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
        <span style={{ fontSize: '36px' }}>✨</span>
        자막 제작 Tip!
      </h2>
        <section className={modalStyles.modalSection}>
          <h3 className={modalStyles.modalSectionTitle}>
            <span style={{ color: '#64b5f6', fontSize: '20px' }}>01</span>
            기본 원칙
          </h3>
          <ul className={modalStyles.modalList}>
            <li>한 슬라이드에 너무 많은 내용을 넣지 않습니다.</li>
            <li>중요한 소리 정보는 대사와 구분되도록 [대괄호]로 표시합니다.</li>
            <li>배경음악이 계속될 경우 ♪ 기호를 사용합니다.</li>
            <li>동시에 들리는 소리는 우선순위를 정해 순차적으로 표시합니다.</li>
            </ul>
        </section>
        <div className={modalStyles.modalNotice}>
          <p className={modalStyles.modalNoticeTitle}>
            <span style={{ fontSize: '24px' }}>💡</span> 가독성을 위한 핵심 팁
          </p>
          <ul className={modalStyles.modalNoticeList}>
            <li>한 슬라이드에 너무 많은 내용을 넣지 않습니다.</li>
            <li>중요한 소리 정보는 대사와 구분되도록 [대괄호]로 표시합니다.</li>
            <li>배경음악이 계속될 경우 ♪ 기호를 사용합니다.</li>
            <li>동시에 들리는 소리는 우선순위를 정해 순차적으로 표시합니다.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
} 