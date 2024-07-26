import { InferSelectModel } from "drizzle-orm";
import {
  customers,
  files,
  folders,
  prices,
  products,
  subscriptions,
  users,
  workspaces,
} from "../../migrations/schema";

export type SUBSCRIPTIONS = InferSelectModel<typeof subscriptions> & {
  prices: PRICE;
};

export type WORKSPACE = InferSelectModel<typeof workspaces>;
export type FOLDER = InferSelectModel<typeof folders>;

export type FILES = InferSelectModel<typeof files>;
export type USER = InferSelectModel<typeof users>;

export type PRODUCT = InferSelectModel<typeof products>;
export type PRICE = InferSelectModel<typeof prices> & { products: PRODUCT };
export type CUSTOMER = InferSelectModel<typeof customers>;

export type PRODUCT_WITH_PRICE = PRODUCT & {
  prices: PRICE[];
};
