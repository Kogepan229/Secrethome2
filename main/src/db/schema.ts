import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, pgEnum, jsonb, smallint, unique, primaryKey } from "drizzle-orm/pg-core";

export const roomTypeEnum = pgEnum("room_type", ["video", "image"]);
export const roomsTable = pgTable("rooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId())
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  roomType: roomTypeEnum("room_type").notNull(),
  accessKey: text("access_key").unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

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
    order: smallint("order"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  },
  (t) => ({
    unique1: unique().on(t.roomId, t.name),
    unique2: unique().on(t.roomId, t.order),
  }),
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
  (t) => ({
    unique1: unique().on(t.groupId, t.name),
  }),
);

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
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .$onUpdate(() => sql`now()`)
    .notNull(),
});

export const contentTagsTable = pgTable(
  "content_tags_table",
  {
    contentId: text("content_id")
      .references(() => contentsTable.id)
      .notNull(),
    tagId: text("tag_id")
      .references(() => tagsTable.id)
      .notNull(),
    order: smallint("order").notNull(),
  },
  (t) => ({
    primary: primaryKey({ columns: [t.contentId, t.tagId] }),
    unique1: unique().on(t.contentId, t.order),
  }),
);
