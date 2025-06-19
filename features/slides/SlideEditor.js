import { useState, useEffect, useRef } from 'react';

const SlideEditor = ({ slide, onSave, onCancel }) => {
  const [editedContent, setEditedContent] = useState(slide);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      
      // 툴바가 에디터 영역을 벗어나지 않도록 위치 조정
      let x = rect.left + (rect.width / 2);
      let y = rect.top - 10;

      if (toolbarRef.current) {
        const toolbarWidth = toolbarRef.current.offsetWidth;
        const toolbarHeight = toolbarRef.current.offsetHeight;
        
        // x 좌표 조정
        x = Math.max(editorRect.left + toolbarWidth/2, x);
        x = Math.min(editorRect.right - toolbarWidth/2, x);
        
        // y 좌표 조정
        if (y < editorRect.top) {
          y = rect.bottom + 10; // 선택영역 아래에 표시
        }
      }

      setToolbarPosition({ x, y });
      setShowFloatingToolbar(true);
    } else {
      setShowFloatingToolbar(false);
    }
  };

  const getCurrentFormat = () => {
    const selection = window.getSelection();
    if (!selection.toString()) return null;

    const range = selection.getRangeAt(0);
    const element = range.commonAncestorContainer.parentElement;
    
    return {
      isBold: window.getComputedStyle(element).fontWeight === '700',
      isItalic: window.getComputedStyle(element).fontStyle === 'italic',
      isUnderline: window.getComputedStyle(element).textDecoration.includes('underline'),
      color: window.getComputedStyle(element).color,
      fontSize: parseInt(window.getComputedStyle(element).fontSize),
      textAlign: window.getComputedStyle(element).textAlign
    };
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    setEditedContent(editorRef.current.innerHTML);
  };

  const handleKeyDown = (e) => {
    // Shift + Enter: 들여쓰기 유지하며 줄바꿈
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      // 현재 줄의 시작 노드와 오프셋 찾기
      const currentNode = range.startContainer;
      const currentOffset = range.startOffset;
      
      // 현재 줄의 텍스트 내용 가져오기
      let currentLine = '';
      let node = currentNode;
      
      // 텍스트 노드인 경우
      if (node.nodeType === 3) {
        currentLine = node.textContent;
        // 부모 노드가 div.line인 경우 해당 div의 전체 내용을 가져옴
        if (node.parentElement.classList.contains('line')) {
          currentLine = node.parentElement.textContent;
        }
      } else if (node.nodeType === 1) { // 요소 노드인 경우
        currentLine = node.textContent;
      }

      // 들여쓰기 계산
      let indentation = '';
      const roleMatch = currentLine.match(/^\s*\(([^)]+)\)\s*/);
      if (roleMatch) {
        indentation = ' '.repeat(roleMatch[0].length);
      }

      // 새로운 div.line 요소 생성
      const newLine = document.createElement('div');
      newLine.className = 'line';
      newLine.style.display = 'flex';
      newLine.style.alignItems = 'flex-start';
      newLine.style.marginBottom = '2px';
      
      // 들여쓰기된 텍스트를 포함하는 span 생성
      const textSpan = document.createElement('span');
      textSpan.textContent = indentation;
      newLine.appendChild(textSpan);

      // 새 줄 삽입
      range.deleteContents();
      range.insertNode(newLine);
      
      // 커서를 새 줄의 들여쓰기 다음 위치로 이동
      const newRange = document.createRange();
      newRange.setStart(textSpan.firstChild || textSpan, indentation.length);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // 에디터 내용 업데이트
      setEditedContent(editorRef.current.innerHTML);
      return;
    }

    // 기존 단축키 지원
    if (e.ctrlKey || e.metaKey) {
      switch(e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          applyFormat('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            applyFormat('redo');
          } else {
            applyFormat('undo');
          }
          break;
      }
    }
  };

  return (
    <div className="slide-editor">
      <div className="main-toolbar">
        <div className="toolbar-group">
          <button onClick={() => applyFormat('undo')} title="실행 취소 (Ctrl+Z)">
            <i className="fas fa-undo"></i>
          </button>
          <button onClick={() => applyFormat('redo')} title="다시 실행 (Ctrl+Shift+Z)">
            <i className="fas fa-redo"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <select 
            onChange={(e) => applyFormat('fontSize', e.target.value)}
            title="글자 크기"
            className="font-size-select"
          >
            <option value="2">작게</option>
            <option value="3">보통</option>
            <option value="4">크게</option>
            <option value="5">더 크게</option>
            <option value="6">매우 크게</option>
            <option value="7">가장 크게</option>
          </select>
        </div>

        <div className="toolbar-group">
          <button onClick={() => applyFormat('justifyLeft')} title="왼쪽 정렬">
            <i className="fas fa-align-left"></i>
          </button>
          <button onClick={() => applyFormat('justifyCenter')} title="가운데 정렬">
            <i className="fas fa-align-center"></i>
          </button>
          <button onClick={() => applyFormat('justifyRight')} title="오른쪽 정렬">
            <i className="fas fa-align-right"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <button onClick={() => applyFormat('insertUnorderedList')} title="글머리 기호">
            <i className="fas fa-list-ul"></i>
          </button>
          <button onClick={() => applyFormat('insertOrderedList')} title="번호 매기기">
            <i className="fas fa-list-ol"></i>
          </button>
        </div>

        <div className="toolbar-group">
          <button onClick={() => applyFormat('outdent')} title="내어쓰기">
            <i className="fas fa-outdent"></i>
          </button>
          <button onClick={() => applyFormat('indent')} title="들여쓰기">
            <i className="fas fa-indent"></i>
          </button>
        </div>
      </div>

      {showFloatingToolbar && (
        <div 
          ref={toolbarRef}
          className="floating-toolbar"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`
          }}
        >
          <button onClick={() => applyFormat('bold')} title="굵게 (Ctrl+B)">
            <i className="fas fa-bold"></i>
          </button>
          <button onClick={() => applyFormat('italic')} title="기울임 (Ctrl+I)">
            <i className="fas fa-italic"></i>
          </button>
          <button onClick={() => applyFormat('underline')} title="밑줄 (Ctrl+U)">
            <i className="fas fa-underline"></i>
          </button>
          <input 
            type="color" 
            onChange={(e) => applyFormat('foreColor', e.target.value)}
            title="글자 색상"
            className="color-picker"
          />
          <input 
            type="color" 
            onChange={(e) => applyFormat('hiliteColor', e.target.value)}
            title="강조 색상"
            className="color-picker"
            defaultValue="#FFEB3B"
          />
        </div>
      )}

      <div 
        ref={editorRef}
        className="editor-content" 
        contentEditable={true}
        onMouseUp={handleTextSelect}
        onKeyUp={handleTextSelect}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: editedContent }}
        onInput={(e) => setEditedContent(e.currentTarget.innerHTML)}
      />

      <div className="editor-controls">
        <button className="cancel-btn" onClick={onCancel}>
          취소
        </button>
        <button className="save-btn" onClick={() => onSave(editedContent)}>
          저장
        </button>
      </div>

      <style jsx>{`
        .slide-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #1a1a1a;
          color: #fff;
        }

        .main-toolbar {
          background: #333;
          padding: 10px;
          display: flex;
          gap: 16px;
          border-bottom: 1px solid #444;
          flex-wrap: wrap;
        }

        .floating-toolbar {
          position: fixed;
          transform: translateX(-50%) translateY(-100%);
          background: #333;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          gap: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          border: 1px solid #444;
        }

        .toolbar-group {
          display: flex;
          gap: 4px;
          padding: 0 8px;
          border-right: 1px solid #444;
        }

        .toolbar-group:last-child {
          border-right: none;
        }

        button {
          background: #444;
          border: none;
          color: white;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button:hover {
          background: #555;
        }

        button:active {
          background: #666;
        }

        .font-size-select {
          background: #444;
          color: white;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          min-width: 80px;
        }

        .color-picker {
          width: 32px;
          height: 32px;
          padding: 2px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background: #444;
        }

        .color-picker::-webkit-color-swatch {
          border: none;
          border-radius: 2px;
        }

        .editor-content {
          flex: 1;
          padding: 40px;
          font-size: 24px;
          line-height: 1.6;
          outline: none;
          overflow-y: auto;
          background: #000;
          border-radius: 8px;
          margin: 20px;
        }

        .editor-content:focus {
          box-shadow: 0 0 0 2px #666;
        }

        .editor-controls {
          padding: 10px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          background: #333;
          border-top: 1px solid #444;
        }

        .save-btn,
        .cancel-btn {
          padding: 8px 20px;
          font-size: 14px;
          min-width: 80px;
        }

        .save-btn {
          background: #4CAF50;
        }

        .save-btn:hover {
          background: #45a049;
        }

        .cancel-btn {
          background: #666;
        }

        .cancel-btn:hover {
          background: #777;
        }

        /* 에디터 내부 스타일 */
        .editor-content ul,
        .editor-content ol {
          margin: 0;
          padding-left: 24px;
        }

        .editor-content li {
          margin: 4px 0;
        }

        .line {
          margin-bottom: 2px;
          display: flex;
          align-items: flex-start;
        }
        
        .line span {
          white-space: pre;
        }
      `}</style>
    </div>
  );
};

export default SlideEditor; 