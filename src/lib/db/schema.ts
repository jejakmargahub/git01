import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  date,
  char,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== USERS ====================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique(), // Made optional for phone-only signups
  phoneNumber: varchar("phone_number", { length: 20 }).unique(), // Added phone number
  password: varchar("password", { length: 255 }), // nullable for OAuth users
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).default("user").notNull(), // 'user', 'superadmin'
  status: varchar("status", { length: 20 }).default("active").notNull(), // 'active', 'disabled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== VERIFICATION TOKENS (OTP) ====================
export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(), // email or phone
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  familyAccess: many(familyAccess),
  createdFamilies: many(families),
}));

// ==================== FAMILIES (Bagan Keluarga) ====================
export const families = pgTable("families", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(false).notNull(), // Existing field for search visibility
  isPublicViewEnabled: boolean("is_public_view_enabled").default(false).notNull(), // New field for link sharing
  publicViewSlug: varchar("public_view_slug", { length: 100 }).unique(), // Unique slug for public view
  inviteCode: varchar("invite_code", { length: 50 }).unique(), // Secret key for invitations
  settings: jsonb("settings").default({}).notNull(), // Per-family settings (e.g. highResEnabled)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const familiesRelations = relations(families, ({ one, many }) => ({
  creator: one(users, {
    fields: [families.createdBy],
    references: [users.id],
  }),
  members: many(familyMembers),
  relationships: many(relationships),
  access: many(familyAccess),
}));

// ==================== ETHNICITIES (Master Data) ====================
export const ethnicities = pgTable("ethnicities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  scriptName: varchar("script_name", { length: 255 }), // e.g. 'Hanacaraka'
  labelName: varchar("label_name", { length: 255 }), // e.g. 'Nama Aksara Jawa'
  fontFamily: varchar("font_family", { length: 255 }), // e.g. 'Noto Sans Javanese'
  isRtl: boolean("is_rtl").default(false).notNull(),
  example: varchar("example", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ethnicitiesRelations = relations(ethnicities, ({ many }) => ({
  members: many(familyMembers),
}));

// ==================== FAMILY MEMBERS ====================
export const familyMembers = pgTable("family_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  ethnicityId: uuid("ethnicity_id").references(() => ethnicities.id), // Link to master data
  fullName: varchar("full_name", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 100 }), // nama panggilan
  mandarinName: varchar("mandarin_name", { length: 100 }), // nama mandarin (legacy)
  regionalName: varchar("regional_name", { length: 255 }), // generalized regional name script
  photoUrl: varchar("photo_url", { length: 500 }), // optional member photo
  gender: char("gender", { length: 1 }).notNull(), // 'M' or 'F'
  birthDate: date("birth_date"),
  deathDate: date("death_date"),
  title: varchar("title", { length: 100 }), // istilah/jabatan: Buyut, Kakek, dll
  phone: varchar("phone", { length: 20 }),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const familyMembersRelations = relations(
  familyMembers,
  ({ one, many }) => ({
    family: one(families, {
      fields: [familyMembers.familyId],
      references: [families.id],
    }),
    ethnicity: one(ethnicities, {
      fields: [familyMembers.ethnicityId],
      references: [ethnicities.id],
    }),
    relationshipsFrom: many(relationships, { relationName: "fromMember" }),
    relationshipsTo: many(relationships, { relationName: "toMember" }),
  })
);

// ==================== RELATIONSHIPS ====================
export const relationships = pgTable("relationships", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  fromMemberId: uuid("from_member_id")
    .notNull()
    .references(() => familyMembers.id, { onDelete: "cascade" }),
  toMemberId: uuid("to_member_id")
    .notNull()
    .references(() => familyMembers.id, { onDelete: "cascade" }),
  relationType: varchar("relation_type", { length: 20 }).notNull(), // 'parent', 'spouse', 'child'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  family: one(families, {
    fields: [relationships.familyId],
    references: [families.id],
  }),
  fromMember: one(familyMembers, {
    fields: [relationships.fromMemberId],
    references: [familyMembers.id],
    relationName: "fromMember",
  }),
  toMember: one(familyMembers, {
    fields: [relationships.toMemberId],
    references: [familyMembers.id],
    relationName: "toMember",
  }),
}));

// ==================== FAMILY ACCESS ====================
export const familyAccess = pgTable("family_access", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // 'admin', 'editor', 'viewer'
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
});

export const familyAccessRelations = relations(familyAccess, ({ one }) => ({
  family: one(families, {
    fields: [familyAccess.familyId],
    references: [families.id],
  }),
  user: one(users, {
    fields: [familyAccess.userId],
    references: [users.id],
  }),
}));

// ==================== MESSAGES (Family Chat) ====================
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  family: one(families, {
    fields: [messages.familyId],
    references: [families.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// ==================== BLOG POSTS ====================
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image", { length: 500 }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  language: varchar("language", { length: 10 }).default("id").notNull(), // 'id', 'en', 'nl', 'zh', 'ja', 'jv', 'sa', 'btk'
  translationGroupId: uuid("translation_group_id"), // group translations of same article
  status: varchar("status", { length: 20 }).default("draft").notNull(), // 'draft', 'published', 'archived'
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// ==================== USER SESSIONS (Analytics & Security) ====================
export const userSessions = pgTable("user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").defaultNow().notNull(),
  lastPing: timestamp("last_ping").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  duration: text("duration").default("0").notNull(), // stored as string to avoid overflow, or use bigint/int if seconds
  ipAddress: varchar("ip_address", { length: 50 }),
  location: varchar("location", { length: 255 }),
  userAgent: text("user_agent"),
});

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

// ==================== FAMILY PHOTOS & TAGS ====================
export const familyPhotos = pgTable("family_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  caption: text("caption"),
  takenAt: timestamp("taken_at"),
  uploadedById: uuid("uploaded_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const familyPhotosRelations = relations(
  familyPhotos,
  ({ one, many }) => ({
    family: one(families, {
      fields: [familyPhotos.familyId],
      references: [families.id],
    }),
    uploadedBy: one(users, {
      fields: [familyPhotos.uploadedById],
      references: [users.id],
    }),
    tags: many(photoTags),
  })
);

export const photoTags = pgTable("photo_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  photoId: uuid("photo_id")
    .notNull()
    .references(() => familyPhotos.id, { onDelete: "cascade" }),
  memberId: uuid("member_id")
    .notNull()
    .references(() => familyMembers.id, { onDelete: "cascade" }),
  // Coordinates as percentages (0-100) for responsiveness
  xPos: integer("x_pos"), 
  yPos: integer("y_pos"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const photoTagsRelations = relations(photoTags, ({ one }) => ({
  photo: one(familyPhotos, {
    fields: [photoTags.photoId],
    references: [familyPhotos.id],
  }),
  member: one(familyMembers, {
    fields: [photoTags.memberId],
    references: [familyMembers.id],
  }),
}));

// ==================== TYPE EXPORTS ====================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Family = typeof families.$inferSelect;
export type NewFamily = typeof families.$inferInsert;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type NewFamilyMember = typeof familyMembers.$inferInsert;
export type Relationship = typeof relationships.$inferSelect;
export type NewRelationship = typeof relationships.$inferInsert;
export type FamilyAccess = typeof familyAccess.$inferSelect;
export type NewFamilyAccess = typeof familyAccess.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
export type Ethnicity = typeof ethnicities.$inferSelect;
export type NewEthnicity = typeof ethnicities.$inferInsert;
export type FamilyPhoto = typeof familyPhotos.$inferSelect;
export type NewFamilyPhoto = typeof familyPhotos.$inferInsert;
export type PhotoTag = typeof photoTags.$inferSelect;
export type NewPhotoTag = typeof photoTags.$inferInsert;
