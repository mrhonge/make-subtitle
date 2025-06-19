import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import modalStyles from '../atoms/Modal.module.css';

export default function GuideModal({ isOpen, onClose }) {
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

  const examples = [
    {
      title: '배역과 대사',
      code: '(나) 안녕하세요! 반갑습니다.',
      description: '배역명은 소괄호 안에, 그 뒤에 대사를 작성'
    },
    {
      title: '일반 지문',
      code: '[큰 소리로 박수를 친다]',
      description: '행동이나 상황 설명은 대괄호 안에 작성'
    },
    {
      title: '효과음',
      code: '[♪ 전화벨 소리가 울린다]',
      description: '♪ 기호와 함께 효과음 설명 작성'
    },
    {
      title: '배경음악',
      code: '[♬ 잔잔한 피아노 선율이 흐른다]',
      description: '♬ 기호와 함께 배경음악 설명 작성'
    },
    {
      title: '슬라이드 구분',
      code: '---',
      description: '새로운 슬라이드로 넘어갈 때 독립된 줄에 작성'
    }
  ];

  const fullExample = `(철수) 안녕하세요! 오늘 날씨가 정말 좋네요.
[소리내어 웃는다]

---

(영희) 네, 정말 그래요. 산책하기 딱 좋은 날씨예요.
[♪ 새소리가 들린다]

---

(모두) 그럼 함께 공원으로 가볼까요?
[♬ 경쾌한 배경음악이 시작된다]`;

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
            📝 대본 작성 가이드
          </h2>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            margin: '0',
            fontWeight: '500'
          }}>
            올바른 형식으로 대본을 작성하면 더 정확한 자막을 생성할 수 있어요
          </p>
        </div>

        {/* 기본 규칙 카드들 */}
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
            기본 작성 규칙
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {examples.map((example, index) => (
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
              onClick={() => handleCopy(example.code, example.title)}
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
                    {example.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(example.code, example.title);
                    }}
                    style={{
                      background: copiedItem === example.title ? '#4caf50' : '#1976d2',
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
                    {copiedItem === example.title ? '✓ 복사됨' : '📋 복사'}
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
                  wordBreak: 'break-all'
                }}>
                  {example.code}
                </div>
                <p style={{ 
                  fontSize: '13px', 
                  color: '#666',
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 완전한 예시 */}
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
            완전한 대본 예시
          </h3>
          
          <div style={{
            border: '2px solid #e8f5e8',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#43a047',
              color: 'white',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>📄 대본_예시.txt</span>
              <button
                onClick={() => handleCopy(fullExample, 'fullExample')}
                style={{
                  background: copiedItem === 'fullExample' ? '#388e3c' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {copiedItem === 'fullExample' ? '✓ 복사 완료!' : '📋 전체 복사'}
              </button>
            </div>
            <pre style={{
              margin: '0',
              padding: '24px',
              fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#333',
              background: 'transparent',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {fullExample}
            </pre>
          </div>
        </div>

        {/* 주의사항 */}
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
              background: '#ff9800', 
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
              !
            </span>
            꼭 확인하세요
          </h3>
          
          <div style={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
            border: '2px solid #ffcc02',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <ul style={{ 
              margin: '0',
              paddingLeft: '20px',
              color: '#333',
              lineHeight: '1.6'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>파일 형식:</strong> 반드시 <code style={{
                  background: '#ffecb3',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>.txt</code> 파일로 저장해주세요
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>괄호와 기호:</strong> 소괄호 <code style={{
                  background: '#ffecb3',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>( )</code>, 대괄호 <code style={{
                  background: '#ffecb3',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>[ ]</code>, 구분선 <code style={{
                  background: '#ffecb3',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '600'
                }}>---</code>를 정확히 입력해주세요
              </li>
              <li>
                <strong>띄어쓰기:</strong> 배역명과 대사 사이는 반드시 띄어쓰기 해주세요
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
} 