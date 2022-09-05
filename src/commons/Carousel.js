import React from "react";
import Carousel from "react-multi-carousel";
import PropTypes from "prop-types";

const CustomCarousel = ({
  className,
  carouselItemData,
  swipeable,
  draggable,
  showDots,
  responsive,
  infinite,
  autoPlay,
  autoPlaySpeed,
  keyBoardControl,
  customTransition,
  transitionDuration,
  containerClass,
  removeArrowOnDeviceType,
  dotListClass,
  itemClass,
}) => {
  // Carousel Item Data
  const items = carouselItemData ? carouselItemData : [];

  return (
    <Carousel
      className={className}
      swipeable={swipeable}
      draggable={draggable}
      showDots={showDots}
      responsive={responsive}
      infinite={infinite}
      autoPlay={autoPlay}
      autoPlaySpeed={autoPlaySpeed}
      keyBoardControl={keyBoardControl}
      customTransition={customTransition}
      transitionDuration={transitionDuration}
      containerClass={containerClass}
      removeArrowOnDeviceType={removeArrowOnDeviceType}
      dotListClass={dotListClass}
      itemClass={itemClass}
    >
      {items}
    </Carousel>
  );
};

export default CustomCarousel;

CustomCarousel.propTypes = {
  className: PropTypes.string,
  carouselItemData: PropTypes.array,
  swipeable: PropTypes.bool,
  draggable: PropTypes.bool,
  showDots: PropTypes.bool,
  responsive: PropTypes.object,
  infinite: PropTypes.bool,
  autoPlay: PropTypes.bool,
  autoPlaySpeed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  keyBoardControl: PropTypes.bool,
  customTransition: PropTypes.string,
  transitionDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  containerClass: PropTypes.string,
  removeArrowOnDeviceType: PropTypes.object,
  dotListClass: PropTypes.string,
  itemClass: PropTypes.string,
};
