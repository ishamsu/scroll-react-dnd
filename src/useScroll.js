import { useEffect, useState, useRef } from "react";

// Define the height from the edge of the viewport where scrolling should start
const BOUND_HEIGHT = 200;

function getScrollDirection({ position, upperBounds = Infinity, lowerBounds = -Infinity }) {
  // Determine the scroll direction based on the current position and bounds
  if (position === undefined) {
    return "stable";
  }
  if (position > lowerBounds - BOUND_HEIGHT) {
    return "bottom";
  }
  if (position < upperBounds + BOUND_HEIGHT) {
    return "top";
  }
  return "stable";
}

export const useScroll = (ref, ref2) => {
  // State to track the current position and whether scrolling is allowed
  const [config, setConfig] = useState({
    position: 0,
    isScrollAllowed: false
  });

  // Speed of scrolling per frame
  const scrollSpeed = 10;
  
  // Ref to keep track of the scroll animation frame ID
  const scrollFrameId = useRef(null);
  
  // Destructure the state to get the current position and scroll allowance
  const { position, isScrollAllowed } = config;

  // Get the bounding rectangle of the referenced element
  const bounds = ref.current?.getBoundingClientRect();
  const bounds1 = ref2.current;

  console.log("this is for list ref", bounds); // For debugging: log bounds to console
  console.log("this is for table", bounds1); // For debugging: log bounds to console

  // Determine the direction of scrolling based on the current position and element bounds
  const direction = getScrollDirection({
    position,
    upperBounds: bounds?.top,
    lowerBounds: bounds?.bottom
  });

  useEffect(() => {
    // Function to perform scrolling and request the next animation frame
    const scroll = () => {
      if (direction !== "stable" && isScrollAllowed) {
        // Scroll the element in the determined direction using tableRef.scrollTop
        const scrollAmount = scrollSpeed * (direction === "top" ? -1 : 1);
        // ref2.current.scrollTop(ref2.current.scrollPosition.top + scrollAmount);
        // Request the next animation frame
        scrollFrameId.current = requestAnimationFrame(scroll);
      }
    };

    // Start scrolling if allowed and direction is not stable
    if (isScrollAllowed) {
      scrollFrameId.current = requestAnimationFrame(scroll);
    }

    // Cleanup function to cancel the animation frame when the component unmounts or dependencies change
    return () => {
      if (scrollFrameId.current) {
        cancelAnimationFrame(scrollFrameId.current);
      }
    };
  }, [isScrollAllowed, direction, ref]);

  // Return a function to update the scroll position and scrolling allowance
  return { updatePosition: setConfig };
};
