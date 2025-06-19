import React from 'react';
import SlidePreview from '../molecules/SlidePreview';
import styles from './SlideList.module.css';

export default function SlideList({ slides, editModes, activeSlideIdx, onSlideClick, renderEditArea, renderSlideActions }) {
  return (
    <div className={styles.slideList}>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          onClick={editModes[idx] ? (e => {
            // 편집모드에서만 바깥 클릭 시 편집모드 해제
            if (e.target === e.currentTarget) {
              onSlideClick(idx);
            }
          }) : undefined}
          style={{ position: 'relative' }}
        >
          {idx > 0 && <div className={styles.slideDivider} />}
          <div className={styles.slideRow}>
            {!editModes[idx] && (
              <SlidePreview
                slide={slide}
                onClick={() => onSlideClick(idx)}
                isActive={!!editModes[idx]}
                idx={idx}
              />
            )}
            {renderSlideActions && renderSlideActions(idx)}
          </div>
          {editModes[idx] && renderEditArea && renderEditArea(idx, slide)}
        </div>
      ))}
    </div>
  );
} 