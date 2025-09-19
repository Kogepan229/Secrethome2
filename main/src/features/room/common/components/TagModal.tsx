import ky from "ky";
import React, { type Dispatch, type SetStateAction, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import useSWR from "swr";
import CrossIcon from "@/assets/button/cross.svg";
import type { TagGroupSchema, TagSchema } from "../schema";

function filterAvailableTags(all: TagSchema[] | undefined, selected: TagSchema[]): TagSchema[] {
  if (!all) {
    return [];
  }

  return all.filter((tag) => {
    return !selected.some((selectedTag) => {
      return selectedTag.id === tag.id;
    });
  });
}

function TagList({
  groupId,
  selectedTagList,
  selectCallback,
}: {
  groupId: string | undefined;
  selectedTagList: TagSchema[];
  selectCallback: Dispatch<SetStateAction<TagSchema[]>>;
}) {
  const { data } = useSWR(`/api/tag/${groupId}`, (url) => ky.get(url).then((res) => res.json<TagSchema[]>()), {
    revalidateOnFocus: false,
  });

  const tags = filterAvailableTags(data, selectedTagList).map((tag) => {
    return (
      <div
        className="w-full h-8 px-2 leading-8 cursor-pointer hover:bg-hover-gray"
        onClick={() => selectCallback((current) => [...current, tag])}
        key={tag.id}
      >
        {tag.name}
      </div>
    );
  });

  return (
    <div className=" overflow-y-auto">
      <div>{tags}</div>
    </div>
  );
}

export function TagModal({
  shouldShow,
  tagGroups,
  selectedTagList,
  closeCallback,
  selectCallback,
}: {
  shouldShow: boolean;
  tagGroups: TagGroupSchema[];
  selectedTagList: TagSchema[];
  closeCallback: () => void;
  selectCallback: Dispatch<SetStateAction<TagSchema[]>>;
}) {
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(() => {
    if (tagGroups.length > 0) {
      return tagGroups[0].id;
    }
    return undefined;
  });

  // State for drag functionality
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  }, []);

  // Common function to constrain position within screen boundaries
  const constrainPositionToScreen = useCallback((x: number, y: number) => {
    if (!modalRef.current) {
      return { x, y };
    }

    const modalRect = modalRef.current.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;

    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = window.innerHeight;

    // Constrain within screen boundaries
    const constrainedX = Math.max(0, Math.min(x, windowWidth - modalWidth));
    const constrainedY = Math.max(0, Math.min(y, windowHeight - modalHeight));

    return { x: constrainedX, y: constrainedY };
  }, []);

  // During dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        // Calculate new position
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Constrain within screen boundaries
        const constrainedPosition = constrainPositionToScreen(newX, newY);

        setPosition(constrainedPosition);
      }
    },
    [isDragging, dragOffset, constrainPositionToScreen],
  );

  // End dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // End dragging when mouse leaves window
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Function to adjust modal position within screen
  const adjustModalPosition = useCallback(() => {
    // Constrain within screen boundaries
    const constrainedPosition = constrainPositionToScreen(position.x, position.y);

    // Update only if position has changed
    if (constrainedPosition.x !== position.x || constrainedPosition.y !== position.y) {
      setPosition(constrainedPosition);
    }
  }, [position.x, position.y, constrainPositionToScreen]);

  // Handle resize event
  const handleResize = useCallback(() => {
    adjustModalPosition();
  }, [adjustModalPosition]);

  // Add/remove mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleMouseLeave]);

  // Center modal when displayed
  useLayoutEffect(() => {
    if (shouldShow) {
      if (!modalRef.current) return;

      const modalRect = modalRef.current.getBoundingClientRect();
      const modalWidth = modalRect.width;
      const modalHeight = modalRect.height;

      const windowWidth = document.documentElement.clientWidth;
      const windowHeight = window.innerHeight;

      const centerX = (windowWidth - modalWidth) / 2;
      const centerY = (windowHeight - modalHeight) / 2;

      setPosition({ x: centerX, y: centerY });
    }
  }, [shouldShow]);

  // Add/remove resize event listeners
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const groupOptions = tagGroups.map((group) => {
    return (
      <option value={group.id} key={group.id}>
        {group.name}
      </option>
    );
  });

  if (!shouldShow) {
    return null;
  }
  return (
    <div
      ref={modalRef}
      className="flex flex-col fixed w-75 h-100 bg-white border-2 border-border-primary shadow-md z-100 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
    >
      <div
        className="flex w-full h-9 border-b-2 bg-border-primary border-b-border-primary cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="grow pl-2 text-white-primary leading-9 font-bold">タグ一覧</div>
        <div className="flex items-center justify-center w-9 h-9 cursor-pointer" onClick={closeCallback}>
          <CrossIcon width={12} height={12} style={{ fill: "white" }} />
        </div>
      </div>
      <div className="flex px-2 py-1 border-b border-b-border-primary gap-2">
        <div className="">グループ</div>
        <select
          className="grow bg-gray-200 rounded-md outline-none cursor-pointer"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.currentTarget.value)}
        >
          {groupOptions}
        </select>
      </div>
      <TagList groupId={selectedGroup} selectedTagList={selectedTagList} selectCallback={selectCallback} />
    </div>
  );
}
