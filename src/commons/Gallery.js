import React from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery';

const Gallery = ({
    items,
    infinite,
    lazyLoad,
    showNav,
    showThumbnails,
    thumbnailPosition,
    showFullscreenButton,
    useBrowserFullscreen,
    useTranslate3D,
    showPlayButton,
    isRTL,
    showBullets,
    showIndex,
    autoPlay,
    disableThumbnailScroll,
    disableKeyDown,
    disableSwipe,
    disableThumbnailSwipe,
    onErrorImageURL,
    indexSeparator,
    slideDuration,
    swipingTransitionDuration,
    slideInterval,
    slideOnThumbnailOver,
    flickThreshold,
    swipeThreshold,
    stopPropagation,
    startIndex,
    onImageError,
    onThumbnailError,
    onThumbnailClick,
    onImageLoad,
    onSlide,
    onBeforeSlide,
    onScreenChange,
    onPause,
    onPlay,
    onClick,
    onTouchMove,
    onTouchEnd,
    onTouchStart,
    onMouseOver,
    onMouseLeave,
    additionalClass,
    renderCustomControls,
    renderItem,
    renderThumbInner,
    renderLeftNav,
    renderRightNav,
    renderPlayPauseButton,
    renderFullscreenButton,
    useWindowKeyDown
}) => {
    return (
        <ImageGallery
            items={items}
            infinite={infinite}
            lazyLoad={lazyLoad}
            showNav={showNav}
            showThumbnails={showThumbnails}
            thumbnailPosition={thumbnailPosition}
            showFullscreenButton={showFullscreenButton}
            useBrowserFullscreen={useBrowserFullscreen}
            useTranslate3D={useTranslate3D}
            showPlayButton={showPlayButton}
            isRTL={isRTL}
            showBullets={showBullets}
            showIndex={showIndex}
            autoPlay={autoPlay}
            disableThumbnailScroll={disableThumbnailScroll}
            disableKeyDown={disableKeyDown}
            disableSwipe={disableSwipe}
            disableThumbnailSwipe={disableThumbnailSwipe}
            onErrorImageURL={onErrorImageURL}
            indexSeparator={indexSeparator}
            slideDuration={slideDuration}
            swipingTransitionDuration={swipingTransitionDuration}
            slideInterval={slideInterval}
            slideOnThumbnailOver={slideOnThumbnailOver}
            flickThreshold={flickThreshold}
            swipeThreshold={swipeThreshold}
            stopPropagation={stopPropagation}
            startIndex={startIndex}
            onImageError={onImageError}
            onThumbnailError={onThumbnailError}
            onThumbnailClick={onThumbnailClick}
            onImageLoad={onImageLoad}
            onSlide={onSlide}
            onBeforeSlide={onBeforeSlide}
            onScreenChange={onScreenChange}
            onPause={onPause}
            onPlay={onPlay}
            onClick={onClick}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            additionalClass={additionalClass}
            renderCustomControls={renderCustomControls}
            renderItem={renderItem}
            renderThumbInner={renderThumbInner}
            renderLeftNav={renderLeftNav}
            renderRightNav={renderRightNav}
            renderPlayPauseButton={renderPlayPauseButton}
            renderFullscreenButton={renderFullscreenButton}
            useWindowKeyDown={useWindowKeyDown}
        />
    );
};

export default Gallery;

Gallery.propTypes = {
    items: PropTypes.array,
    infinite: PropTypes.bool,
    lazyLoad: PropTypes.bool,
    showNav: PropTypes.bool,
    showThumbnails: PropTypes.bool,
    thumbnailPosition: PropTypes.string,
    showFullscreenButton: PropTypes.bool,
    useBrowserFullscreen: PropTypes.bool,
    useTranslate3D: PropTypes.bool,
    showPlayButton: PropTypes.bool,
    isRTL: PropTypes.bool,
    showBullets: PropTypes.bool,
    showIndex: PropTypes.bool,
    autoPlay: PropTypes.bool,
    disableThumbnailScroll: PropTypes.bool,
    disableKeyDown: PropTypes.bool,
    disableSwipe: PropTypes.bool,
    disableThumbnailSwipe: PropTypes.bool,
    onErrorImageURL: PropTypes.string,
    indexSeparator: PropTypes.string,
    slideDuration: PropTypes.number,
    swipingTrans: PropTypes.number,
    slideOnThumbnailOver: PropTypes.bool,
    flickThreshold: PropTypes.number,
    swipeThreshold: PropTypes.number,
    stopPropagation: PropTypes.bool,
    startIndex: PropTypes.number,
    onImageError: PropTypes.func,
    onThumbnailError: PropTypes.func,
    onThumbnailClick: PropTypes.func,
    onImageLoad: PropTypes.func,
    onSlide: PropTypes.func,
    onBeforeSlide: PropTypes.func,
    onScreenChange: PropTypes.func,
    onPause: PropTypes.func,
    onPlay: PropTypes.func,
    onClick: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchStart: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseLeave: PropTypes.func,
    additionalClass: PropTypes.string,
    renderCustomControls: PropTypes.func,
    renderItem: PropTypes.func,
    renderThumbInner: PropTypes.func,
    renderLeftNav: PropTypes.func,
    renderRightNav: PropTypes.func,
    renderPlayPauseButton: PropTypes.func,
    renderFullscreenButton: PropTypes.func,
    useWindowKeyDown: PropTypes.bool
};
