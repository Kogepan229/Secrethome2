import { BasicButton } from "@/components/BasicButton";
import { formStyles } from "@/components/form/formStyles";
import { type Dispatch, type SetStateAction, use, useState } from "react";
import type { TagGroupSchema, TagSchema } from "../schema";
import { TagModal } from "./TagModal";

type Props = {
  label: string;
  tagGroups: Promise<TagGroupSchema[]>;
  selectedTags: TagSchema[];
  setSelectedTags: Dispatch<SetStateAction<TagSchema[]>>;
};

export function FormTag(props: Props) {
  const [isOpenedTagModal, setIsOpenedTagModal] = useState(false);
  const tagGroups = use(props.tagGroups);

  const selectedTagListElements = tagGroups.map((tagGroup) => {
    const tags = props.selectedTags.filter((tag) => tag.groupId === tagGroup.id);
    if (tags.length === 0) return null;

    const tagElements = tags.map((tag) => {
      function removeTag() {
        props.setSelectedTags((current) => current.filter((selectedTag) => selectedTag.id !== tag.id));
      }

      return (
        <span
          className="px-1 pb-0.5 bg-border-primary text-white-primary rounded-sm text-sm hover:bg-primary cursor-pointer"
          onClick={removeTag}
          key={tag.id}
        >
          {tag.name}
        </span>
      );
    });

    return (
      <div key={tagGroup.id}>
        <span className="block mb-1 text-black-primary">{tagGroup.name}</span>
        <div className="flex gap-1 flex-wrap">{tagElements}</div>
      </div>
    );
  });

  return (
    <div className={formStyles.wrapper()}>
      <div>
        <div className={formStyles.label()}>{props.label}</div>
        <BasicButton className="h-8 mt-1 p-1.5 leading-4" onClick={() => setIsOpenedTagModal((current) => !current)}>
          {isOpenedTagModal ? "閉じる" : "タグを選択"}
        </BasicButton>
        <div className="mt-1 px-2 pt-1 pb-2 bg-gray-100 rounded-md">{selectedTagListElements}</div>
      </div>
      <TagModal
        shouldShow={isOpenedTagModal}
        tagGroups={tagGroups}
        selectedTagList={props.selectedTags}
        closeCallback={() => setIsOpenedTagModal(false)}
        selectCallback={props.setSelectedTags}
      />
    </div>
  );
}
