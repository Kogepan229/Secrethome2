import { getContentTags } from "../../tag/utils/tag";
import type { ContentSchema, TagSchema } from "../schema";
import { InternalContentPanel } from "./InternalContentPanel";

async function getTagsWithGroup(contentId: string) {
  const tags = await getContentTags(contentId);

  const tagsWithGroup: { [groupId: string]: TagSchema[] } = {};

  for (const tag of tags) {
    if (!(tag.groupId in tagsWithGroup)) {
      tagsWithGroup[tag.groupId] = [];
    }

    tagsWithGroup[tag.groupId].push(tag);
  }

  return tagsWithGroup;
}

export async function ContentPanel({ content }: { content: ContentSchema }) {
  return <InternalContentPanel content={content} tagsWithGroup={getTagsWithGroup(content.id)} />;
}
