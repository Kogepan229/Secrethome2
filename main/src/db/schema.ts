import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { jsonb, pgEnum, pgTable, primaryKey, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import type { CustomDescriptionCategory } from "@/features/admin/types";

export const adminTable = pgTable("admin", {
  password: text("password").notNull(),
});

export const roomTypeEnum = pgEnum("room_type", ["video", "image"]);
export const roomsTable = pgTable("rooms", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  customDescriptionList: jsonb("custom_description_list").$type<CustomDescriptionCategory[]>().default([]),
  roomType: roomTypeEnum("room_type").notNull(),
  accessKey: text("access_key").unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const customDescriptionsTable = pgTable(
  "custom_descriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId())
      .notNull(),
    contentId: text("content_id")
      .references(() => contentsTable.id)
      .notNull(),
    description: text("description").notNull(),
  },
  (t) => [unique().on(t.id, t.contentId)],
);

export const tagGroupsTable = pgTable(
  "tag_groups",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId())
      .notNull(),
    roomId: text("room_id")
      .references(() => roomsTable.id)
      .notNull(),
    name: text("name").notNull(),
    description: text("description"),
    order: serial("order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (t) => [unique().on(t.roomId, t.name), unique().on(t.roomId, t.order)],
);

export const tagsTable = pgTable(
  "tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId())
      .notNull(),
    groupId: text("group_id")
      .references(() => tagGroupsTable.id)
      .notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (t) => [unique().on(t.groupId, t.name)],
);

export const contentStatusTypeEnum = pgEnum("content_status_type", ["processing", "available", "deleted", "error"]);
export const contentsTable = pgTable("contents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  roomId: text("room_id")
    .references(() => roomsTable.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailId: text("thumbnail_id"),
  status: contentStatusTypeEnum("status")
    .$default(() => "processing")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const contentTagsTable = pgTable(
  "content_tags_table",
  {
    contentId: text("content_id")
      .references(() => contentsTable.id, { onDelete: "cascade" })
      .notNull(),
    tagId: text("tag_id")
      .references(() => tagsTable.id, { onDelete: "cascade" })
      .notNull(),
    order: serial("order").notNull(),
  },
  (t) => [primaryKey({ columns: [t.contentId, t.tagId] }), unique().on(t.contentId, t.order)],
);

export const contentVideoTable = pgTable("content_video_table", {
  contentId: text("content_id")
    .references(() => contentsTable.id, { onDelete: "cascade" })
    .notNull(),
  videoId: text("video_id").notNull(),
});
