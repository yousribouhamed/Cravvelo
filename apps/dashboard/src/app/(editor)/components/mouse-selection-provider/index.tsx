"use client";
import { useState, useRef } from "react";

export default function MouseSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const selectionBoxRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    setDragging(true);
    setStartPosition({ x: clientX, y: clientY });
    selectionBoxRef.current.style.left = `${clientX}px`;
    selectionBoxRef.current.style.top = `${clientY}px`;
    selectionBoxRef.current.style.display = "block";
    setSelectedItems([]);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const { clientX, clientY } = event;
      const width = clientX - startPosition.x;
      const height = clientY - startPosition.y;
      selectionBoxRef.current.style.width = `${Math.abs(width)}px`;
      selectionBoxRef.current.style.height = `${Math.abs(height)}px`;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    selectionBoxRef.current.style.display = "none";
  };

  const handleItemSelection = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}
      <div ref={selectionBoxRef} className="selection-box" />
    </div>
  );
}
