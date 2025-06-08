import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  smallint,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(12)),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  prints: many(prints),
}));

export const prints = pgTable("print", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid(12)),
  width: smallint().notNull().default(384),
  authorId: text().references(() => users.id),
  title: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp({ mode: "date", precision: 0 }).$onUpdate(
    () => new Date()
  ),
});

export const printsRelations = relations(prints, ({ many, one }) => ({
  sections: many(sections),
  author: one(users, {
    fields: [prints.authorId],
    references: [users.id],
  }),
}));

export const fontEnum = pgEnum("font", [
  "Boxxy - 14",
  "Cherry - 10",
  "Cherry - 11",
  "Cherry - 13",
  "Ctrld - 10",
  "Ctrld - 13",
  "Ctrld - 16",
  "Dina - 10",
  "Dina - 12",
  "Dina - 13",
  "Dylex - 10",
  "Dylex - 13",
  "Dylex - 20",
  "Gohufont - 11",
  "Gohufont - 14",
  "Kakwa - 12",
  "Lokaltog - 10",
  "Lokaltog - 12",
  "MPlus - 10",
  "MPlus - 12",
  "Orp - 12",
  "Scientifica - 11",
  "Sq - 15",
  "Terminus - 14",
  "Terminus - 16",
  "Terminus - 18",
  "Terminus - 20",
  "Terminus - 22",
  "Terminus - 24",
  "Terminus - 28",
  "Terminus - 32",
  "Tewi - 11",
  "Triskweline - 13",
]);

export const alignEnum = pgEnum("align", ["left", "center", "right"]);

export const sections = pgTable("section", {
  id: serial().primaryKey(),
  textId: integer().references(() => texts.id, { onDelete: "cascade" }),
  printId: text()
    .references(() => prints.id)
    .notNull(),
});

export const sectionsRelations = relations(sections, ({ one }) => ({
  text: one(texts, {
    fields: [sections.textId],
    references: [texts.id],
  }),
  print: one(prints, {
    fields: [sections.printId],
    references: [prints.id],
  }),
}));

export const texts = pgTable("text", {
  id: serial().primaryKey(),
  text: text().notNull(),
  font: fontEnum().notNull(),
  align: alignEnum().notNull(),
});
