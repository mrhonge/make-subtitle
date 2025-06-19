import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import modalStyles from '../atoms/Modal.module.css';

export default function CaptionTipModal({ isOpen, onClose }) {
  const [copiedItem, setCopiedItem] = useState('');

  const handleCopy = async (text, itemName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const accessibilityTips = [
    {
      title: '소음 구분하기',
      code: '(철수) 잠깐만... 뭐야?\n[갑작스러운 천둥소리]\n(철수) (놀라며) 어!',
      description: '갑작스러운 소음과 그에 대한 반응을 순서대로 표기'
    },
    {
      title: '겹치는 대화',
      code: '(영희) 그런데 말이야—\n(철수) —아, 나도 그 생각했어!\n[두 사람이 동시에 말함]',
      description: '여러 사람이 동시에 말할 때 우선순위와 상황 설명'
    },
    {
      title: '비언어적 소리',
      code: '(영희) 그래서... 음...\n[머뭇거리는 소리]\n[한숨을 쉬며]',
      description: '말 사이의 소리나 감정 표현도 중요한 정보'
    },
    {
      title: '음량과 거리감',
      code: '(무대 뒤에서) 여기 있어요!\n(가까이 오며) 찾았다!',
      description: '소리의 위치나 음량 변화를 괄호로 표현'
    }
  ];

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
            ♿ 접근성 향상을 위한 대본 작성 Tip
          </h2>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            margin: '0',
            fontWeight: '500'
          }}>
            청각장애인 관객을 위한 더 세심한 음성 정보 표기법
          </p>
        </div>

        {/* 접근성 팁 예시 */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#333',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              background: '#1976d2', 
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              1
            </span>
            접근성 향상 기법
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {accessibilityTips.map((tip, index) => (
              <div key={index} style={{
                border: '2px solid #e3f2fd',
                borderRadius: '12px',
                padding: '20px',
                background: 'linear-gradient(135deg, #fafbff 0%, #f8f9fa 100%)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1976d2';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(25, 118, 210, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => handleCopy(tip.code, tip.title)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    color: '#1976d2',
                    margin: '0'
                  }}>
                    {tip.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(tip.code, tip.title);
                    }}
                    style={{
                      background: copiedItem === tip.title ? '#4caf50' : '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '60px'
                    }}
                  >
                    {copiedItem === tip.title ? '✓ 복사됨' : '📋 복사'}
                  </button>
                </div>
                <div style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '12px',
                  fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace',
                  fontSize: '14px',
                  color: '#333',
                  marginBottom: '8px',
                  border: '1px solid #e0e0e0',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word'
                }}>
                  {tip.code}
                </div>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#666',
                  margin: '0',
                  lineHeight: 1.4
                }}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 접근성 체크리스트 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#333',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              background: '#43a047', 
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              2
            </span>
            접근성 체크리스트
          </h3>

          {/* 필수 체크 항목들 */}
          <div style={{
            border: '2px solid #e8f5e8',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#43a047',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✅ 필수 체크 항목
            </h4>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              <li style={{ marginBottom: '6px' }}>모든 음성 정보(대사, 효과음, 음악)가 포함되었는가?</li>
              <li style={{ marginBottom: '6px' }}>화자가 명확하게 구분되어 있는가?</li>
              <li style={{ marginBottom: '6px' }}>감정이나 톤의 변화가 표기되었는가?</li>
              <li>동시에 일어나는 소리들의 우선순위가 정해졌는가?</li>
            </ul>
          </div>

          {/* 읽기 편의성 */}
          <div style={{
            border: '2px solid #fff3e0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #fff8e1 0%, #ffffff 100%)'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#ff9800',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📖 읽기 편의성
            </h4>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              <li style={{ marginBottom: '6px' }}>한 슬라이드에 너무 많은 정보가 들어가지 않았는가?</li>
              <li style={{ marginBottom: '6px' }}>글자 수가 적절한가? (1-2줄, 20-30자 권장)</li>
              <li style={{ marginBottom: '6px' }}>중요한 소리와 배경 소리가 구분되는가?</li>
              <li>침묵이나 공백도 필요하다면 표기했는가?</li>
            </ul>
          </div>

          {/* 실시간 송출 고려사항 */}
          <div style={{
            border: '2px solid #f3e5f5',
            borderRadius: '12px',
            padding: '20px',
            background: 'linear-gradient(135deg, #fce4ec 0%, #ffffff 100%)'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#9c27b0',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚡ 실시간 송출 팁
            </h4>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              <li style={{ marginBottom: '6px' }}>배우의 애드리브에 대비한 여백 슬라이드 준비</li>
              <li style={{ marginBottom: '6px' }}>관객 반응(박수, 웃음)에 대한 대비책 마련</li>
              <li style={{ marginBottom: '6px' }}>기술적 문제 시 "잠시 기다려 주세요" 등의 안내문</li>
              <li>슬라이드 넘김 타이밍을 리허설에서 충분히 연습</li>
            </ul>
          </div>
        </div>

        {/* 중요 메시지 */}
        <div style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%)',
          border: '2px solid #1976d2',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1976d2',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            💙 접근성의 진정한 의미
          </h4>
          <p style={{ 
            margin: '0',
            color: '#333',
            fontSize: '15px',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            접근성 자막은 단순한 번역이 아닙니다.<br/>
            <strong>모든 관객이 동등하게 연극을 경험할 수 있도록 돕는</strong> 중요한 다리 역할입니다.<br/>
            여러분의 세심한 배려가 더 많은 사람들에게 감동을 전할 수 있습니다.
          </p>
        </div>
      </div>
    </Modal>
  );
} 