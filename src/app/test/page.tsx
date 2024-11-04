// components/ExpandableText.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import './a.css'

export default function ExpandableText() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Calculate line height
      const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
      const elementHeight = textRef.current.clientHeight;
      const lineCount = Math.round(elementHeight / lineHeight);

      // Show button if the text is longer than 4 lines
      setShowButton(lineCount > 4);
    }
  }, []);

  const toggleText = () => setIsExpanded((prev) => !prev);

  return (
    <div className="max-w-sm">
      {/* Image */}
      <img
        src="https://via.placeholder.com/300"
        alt="Sample"
        className="w-full h-48 object-contain"
      />

      {/* Text */}
      <p
        ref={textRef}
        className={`mt-4 text-gray-800 transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-4"
        }`}
      >
        This is a long paragraph of text that will be truncated to only show
        four lines. If the text exceeds four lines, it will end with an
        ellipsis. When the "Read More" button is clicked, the full text will be
        displayed, allowing the user to read everything. This is great for
        summarizing large amounts of content in a compact space.
      </p>

      {/* Read More / Show Less Button */}
      {showButton && (
        <button
          onClick={toggleText}
          className="text-blue-500 hover:underline mt-2"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}
