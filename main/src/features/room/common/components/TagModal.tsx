import ky from "ky";
import { type Dispatch, type SetStateAction, useState } from "react";
import useSWR from "swr";
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
  const { data, error, isLoading } = useSWR(`/api/tag/${groupId}`, (url) => ky.get(url).then((res) => res.json<TagSchema[]>()), {
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
    <div className="flex flex-col fixed w-75 h-100 bg-white border-2 border-border-primary shadow-md z-100">
      <div className="flex w-full h-9 border-b-2 border-b-border-primary">
        <div className="grow pl-2 bg-border-primary text-white-primary leading-9 font-bold">タグ一覧</div>
        <div className="w-9 h-9 border-l-2 border-l-border-primary" onClick={closeCallback} />
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
      <div>{selectedGroup}</div>
      <TagList groupId={selectedGroup} selectedTagList={selectedTagList} selectCallback={selectCallback} />
    </div>
  );
}
