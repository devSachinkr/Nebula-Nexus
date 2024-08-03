import { Database, Json } from "./supabase";

export type SUPABASE_FILE = {
  banner_url: string | null;
  created_at: string;
  data: string | null;
  folder_id: string;
  icon_id: string;
  id: string;
  in_trash: string | null;
  title: string;
  workspace_id: string;
};

export type SUPABASE_FOLDER = {
  banner_url: string | null;
  created_at: string;
  data: string | null;
  icon_id: string | null;
  id: string;
  in_trash: string | null;
  title: string;
  workspace_id: string;
};

export type SUPABASE_WORKSPACE = {
  banner_url: string | null;
  created_at: string;
  data: string | null;
  icon_id: string;
  id: string;
  in_trash: string | null;
  logo: string | null;
  title: string;
  workspace_owner: string;
};

export type SUPABASE_SUBSCRIPTION = {
  cancel_at: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  created: string;
  current_period_end: string;
  current_period_start: string;
  ended_at: string | null;
  id: string;
  metadata: Json | null;
  price_id: string | null;
  quantity: number | null;
  status: Database["public"]["Enums"]["subscription_status"] | null;
  trial_end: string | null;
  trial_start: string | null;
  user_id: string;
};

export type SUPABASE_PRICE = {
  active: boolean | null;
  currency: string | null;
  description: string | null;
  id: string;
  interval: Database["public"]["Enums"]["pricing_plan_interval"] | null;
  interval_count: number | null;
  metadata: Json | null;
  product_id: string | null;
  trial_period_days: number | null;
  type: Database["public"]["Enums"]["pricing_type"] | null;
  unit_amount: number | null;
} & { products: SUPABASE_PRODUCT };
export type SUPABASE_PRODUCT = {
  active: boolean | null;
  description: string | null;
  id: string;
  image: string | null;
  metadata: Json | null;
  name: string | null;
};

export type SUPABASE_USER = {
  avatar_url: string | null;
  billing_address: Json | null;
  email: string | null;
  full_name: string | null;
  id: string;
  payment_method: Json | null;
  updated_at: string | null;
};

export type SUPABASE_CUSTOMER = {
  id: string;
  stripe_customer_id: string | null;
};

export type SUPABASE_COLLABORATORS = {
  created_at: string;
  id: string;
  user_id: string;
  workspace_id: string;
};

export type SUPABASE_PRODUCT_WITH_PRICE = SUPABASE_PRODUCT & {
  price: SUPABASE_PRICE;
};
