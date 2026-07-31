


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."account_status" AS ENUM (
    'pending',
    'approved',
    'suspended'
);


ALTER TYPE "public"."account_status" OWNER TO "postgres";


CREATE TYPE "public"."order_status" AS ENUM (
    'pending',
    'paid',
    'cancelled'
);


ALTER TYPE "public"."order_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'customer',
    'affiliate',
    'admin'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."approve_topup"("topup_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_user_id UUID;
  v_amount DECIMAL;
BEGIN
  -- 1. Lấy thông tin user_id và số tiền từ bảng topups (chỉ khi đang pending)
  SELECT user_id, amount INTO v_user_id, v_amount
  FROM topups
  WHERE id = topup_id AND status = 'pending'
  FOR UPDATE; -- Khóa dòng này lại để tránh race condition

  -- 2. Nếu không tìm thấy hoặc đã xử lý rồi thì thoát
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Giao dịch không tồn tại hoặc đã được xử lý trước đó.';
  END IF;

  -- 3. Cập nhật bảng topups: status và real_amount
  UPDATE topups
  SET 
    status = 'completed',
    real_amount = amount,
    updated_at = NOW()
  WHERE id = topup_id;

  -- 4. Cộng tiền vào bảng profiles
  UPDATE profiles
  SET balance = balance + v_amount -- Giả sử cột tiền ở profiles tên là amount
  WHERE user_id = v_user_id;

    ---- 5. Lưu lịch sử giao dịch vào transaction
  INSERT INTO wallet_transactions (user_id, amount, type, description)
  VALUES (v_user_id, v_amount, 'add', 'Admin chấp nhận');

END;
$$;


ALTER FUNCTION "public"."approve_topup"("topup_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."complete_order"("p_order_id" "uuid", "p_provider_order_code" "text", "p_tickets" "jsonb", "p_reference_code" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_user_id UUID;
  v_total_amount NUMERIC;
  v_balance NUMERIC;
BEGIN

  -- Lock order
  SELECT
    user_id,
    total_amount
  INTO
    v_user_id,
    v_total_amount
  FROM orders
  WHERE id = p_order_id
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order không hợp lệ hoặc đã xử lý';
  END IF;

  -- Lock số dư
  SELECT balance
  INTO v_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Không tìm thấy user';
  END IF;

  IF v_balance < v_total_amount THEN
    RAISE EXCEPTION 'Số dư không đủ';
  END IF;

  -- Trừ tiền
  UPDATE profiles
  SET balance = balance - v_total_amount
  WHERE user_id = v_user_id;

  -- Ghi lịch sử ví
  INSERT INTO wallet_transactions (
    user_id,
    amount,
    type,
    order_id,
    description
  )
  VALUES (
    v_user_id,
    -v_total_amount,
    'ticket_buy',
    p_order_id,
    'Rút vé'
  );

  -- Lưu danh sách vé
INSERT INTO tickets (
  order_id,
  ticket_code,
  provider_ticket_code,
  status,
  order_code,
  site_code,
  product_name,
  product_code,
  ticket_number,
  valid_date_from
)
SELECT
  p_order_id,
  t->>'ticketNumber',
  t->>'ticketNumber',
  'unused',
  p_provider_order_code,
  t->>'siteCode',
  t->>'productName',
  t->>'productCode',
  t->>'ticketNumber',
  t->>'validDateFrom'
FROM jsonb_array_elements(p_tickets) t;

  -- Cập nhật order thành công
  UPDATE orders
  SET
    status = 'success',
    paid_at = now(),
    order_code = p_provider_order_code,
    reference_code = p_reference_code
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'provider_order_code', p_provider_order_code
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;


ALTER FUNCTION "public"."complete_order"("p_order_id" "uuid", "p_provider_order_code" "text", "p_tickets" "jsonb", "p_reference_code" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."complete_order_customer"("p_order_id" "uuid", "p_provider_order_code" "text", "p_reference_code" "text", "p_tickets" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
BEGIN

  -- Lock order
  PERFORM 1
  FROM orders
  WHERE id = p_order_id
    AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order không hợp lệ hoặc đã xử lý';
  END IF;

  -- Lưu danh sách vé
  INSERT INTO tickets (
    order_id,
    ticket_code,
    provider_ticket_code,
    status,
    order_code,
    site_code,
    product_name,
    product_code,
    ticket_number,
    valid_date_from
  )
  SELECT
    p_order_id,
    t->>'ticketNumber',
    t->>'ticketNumber',
    'unused',
    p_provider_order_code,
    t->>'siteCode',
    t->>'productName',
    t->>'productCode',
    t->>'ticketNumber',
    (t->>'validDateFrom')::date
  FROM jsonb_array_elements(p_tickets) t;

  -- Cập nhật order thành công
  UPDATE orders
  SET
    status = 'success',
    order_code = p_provider_order_code,
    reference_code = p_reference_code,
    paid_at = now()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'provider_order_code', p_provider_order_code
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;


ALTER FUNCTION "public"."complete_order_customer"("p_order_id" "uuid", "p_provider_order_code" "text", "p_reference_code" "text", "p_tickets" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_order_pending"("p_user_id" "uuid", "p_list_ticket_submit" "jsonb", "p_total_amount" numeric, "p_user_email" "text", "p_date_use" "date", "p_order_des" "text", "p_payment_method" "text", "p_side_code" "text", "p_third_party_num" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_current_balance numeric;
  v_order_id uuid;
BEGIN

  -- Validate danh sách vé
  IF p_list_ticket_submit IS NULL
     OR jsonb_typeof(p_list_ticket_submit) <> 'array'
     OR jsonb_array_length(p_list_ticket_submit) = 0
  THEN
    RAISE EXCEPTION 'Danh sách vé không hợp lệ';
  END IF;

  -- Lấy số dư user
  SELECT balance
  INTO v_current_balance
  FROM profiles
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Người dùng không tồn tại';
  END IF;

  -- Kiểm tra số dư
  IF v_current_balance < p_total_amount THEN
    RAISE EXCEPTION
      'Số dư không đủ. Cần %, hiện có %',
      p_total_amount,
      v_current_balance;
  END IF;

  -- Tạo order
  INSERT INTO orders (
    user_id,
    total_amount,
    status,
    description,
    payment_method,
    user_email,
    created_at,
    site_code,
    third_party_number
  )
  VALUES (
    p_user_id,
    p_total_amount,
    'pending',
    p_order_des,
    p_payment_method,
    p_user_email,
    now(),
    p_side_code,
    p_third_party_num
  )
  RETURNING id
  INTO v_order_id;

  -- Tạo order items
  INSERT INTO order_items (
    order_id,
    product_code,
    product_name,
    quantity,
    price,
    date_use
  )
  SELECT
    v_order_id,
    item->>'product_code',
    item->>'product_name',
    (item->>'quantity')::int,
    (item->>'price')::numeric,
    p_date_use
  FROM jsonb_array_elements(p_list_ticket_submit) item;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'status', 'pending'
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;


ALTER FUNCTION "public"."create_order_pending"("p_user_id" "uuid", "p_list_ticket_submit" "jsonb", "p_total_amount" numeric, "p_user_email" "text", "p_date_use" "date", "p_order_des" "text", "p_payment_method" "text", "p_side_code" "text", "p_third_party_num" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."customer_buy_ticket"("c_total_amount" numeric, "c_user_email" "text", "c_phone" "text", "c_fullname" "text", "c_payment_code" "text", "c_site_code" "text", "c_third_party_num" "text", "c_date_use" "date", "c_order_code" "text", "list_ticket_submit" "jsonb") RETURNS json
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  item jsonb;

  v_order_id uuid;
  v_order_item_id uuid;

  v_product_code text;
  v_quantity int;
  v_price numeric;
   v_product_name text;
BEGIN

  --------------------------------
  -- Tạo order
  --------------------------------
  INSERT INTO orders (
    total_amount,
    status,
    status_payment,
    user_email,
    phone,
    fullname,
    payment_code,
    payment_method,
    third_party_number,
    site_code,
    order_code
  )
  VALUES (
    c_total_amount,
    'pending',
    'pending',
    c_user_email,
    c_phone,
    c_fullname,
    c_payment_code,
    'customer',
    c_third_party_num,
    c_site_code,
    c_order_code
  )
  RETURNING id INTO v_order_id;

  --------------------------------
  -- Tạo order items
  --------------------------------

  FOR item IN
    SELECT *
    FROM jsonb_array_elements(list_ticket_submit)
  LOOP

    v_product_code := item->>'productCode';
    v_quantity := (item->>'quantity')::int;
    v_price := (item->>'unitPrice')::numeric;
    v_product_name := (item->>'productsName')::text;

    INSERT INTO order_items (
      order_id,
      quantity,
      price,
      date_use,
      product_code,
      product_name
    )
    VALUES (
      v_order_id,
      v_quantity,
      v_price,
      c_date_use,
      v_product_code,
      v_product_name
    );

  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'status', 'pending'
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', SQLERRM
    );
END;
$$;


ALTER FUNCTION "public"."customer_buy_ticket"("c_total_amount" numeric, "c_user_email" "text", "c_phone" "text", "c_fullname" "text", "c_payment_code" "text", "c_site_code" "text", "c_third_party_num" "text", "c_date_use" "date", "c_order_code" "text", "list_ticket_submit" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_agent_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_email" "text" DEFAULT NULL::"text") RETURNS TABLE("user_email" "text", "total_tickets" bigint, "total_amount" numeric)
    LANGUAGE "sql"
    AS $$
  SELECT
    vsh.user_email,
    SUM(vsh.quantity) AS total_tickets,
    SUM(vsh.total) AS total_amount
  FROM view_sale_history vsh
  WHERE vsh.status = 'success'
    AND vsh.payment_method = 'agent'
    AND vsh.created_at >= p_start
    AND vsh.created_at < p_end
    AND (
      p_email IS NULL
      OR p_email = ''
      OR vsh.user_email = p_email
    )
  GROUP BY vsh.user_email
  ORDER BY SUM(vsh.total) DESC;
$$;


ALTER FUNCTION "public"."get_agent_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone) RETURNS TABLE("payment_method" "text", "total_tickets" bigint, "total_amount" numeric)
    LANGUAGE "sql"
    AS $$
  SELECT
    payment_method,
    SUM(quantity) AS total_tickets,
    SUM(total) AS total_amount
  FROM view_sale_history
  WHERE status = 'success'
    AND created_at >= p_start
    AND created_at < p_end
  GROUP BY payment_method;
$$;


ALTER FUNCTION "public"."get_all_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin

insert into public.profiles (user_id,email)
values (new.id,new.email);

return new;

end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_topup_webhook"("payment_code_transf" "text", "amount_to_add" numeric) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  target_user_id uuid;
BEGIN

  UPDATE topups
  SET
    status = 'completed',
    updated_at = now(),
    real_amount = amount_to_add
  WHERE payment_code = payment_code_transf
    AND status = 'pending'
  RETURNING user_id
  INTO target_user_id;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Mã giao dịch không tồn tại hoặc đã được xử lý';
  END IF;

  UPDATE profiles
  SET balance = balance + amount_to_add
  WHERE user_id = target_user_id;

  INSERT INTO wallet_transactions (
    user_id,
    amount,
    type,
    description,
    created_at
  )
  VALUES (
    target_user_id,
    amount_to_add,
    'add',
    payment_code_transf,
    now()
  );

END;
$$;


ALTER FUNCTION "public"."handle_topup_webhook"("payment_code_transf" "text", "amount_to_add" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$

select exists(
  select 1
  from public.profiles
  where user_id = auth.uid()
  and role = 'admin'
);

$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."agent_prices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "agent_code" "text",
    "price" double precision,
    "site_code" "text"
);


ALTER TABLE "public"."agent_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."agents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text"
);


ALTER TABLE "public"."agents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."category" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text"
);


ALTER TABLE "public"."category" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "quantity" integer,
    "price" numeric,
    "date_use" "date",
    "product_code" "text",
    "product_name" "text"
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "total_amount" numeric,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "description" "text",
    "payment_method" "text",
    "user_email" "text",
    "phone" "text",
    "payment_code" "text",
    "paid_at" "text",
    "buy_by" "text",
    "order_code" "text",
    "reference_code" "text",
    "site_code" "text",
    "third_party_number" "text",
    "fullname" "text",
    "status_payment" "text"
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "personType" "text",
    "publicPrice" numeric NOT NULL,
    "unitPrice" numeric NOT NULL,
    "site_code" "text",
    "promo_code" "text"
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "email" "text",
    "username" "text",
    "full_name" "text",
    "phone" "text",
    "address" "text",
    "role" "public"."user_role" DEFAULT 'affiliate'::"public"."user_role" NOT NULL,
    "status" "public"."account_status" DEFAULT 'pending'::"public"."account_status" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "balance" bigint DEFAULT 0 NOT NULL,
    "agent_level" "text" DEFAULT 'level_1'::"text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promo" (
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "description" "text",
    "site_code" "text" NOT NULL,
    "status" boolean
);


ALTER TABLE "public"."promo" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promo_price" (
    "id" bigint NOT NULL,
    "price" numeric NOT NULL,
    "product_code" "text" NOT NULL,
    "promo_code" "text"
);


ALTER TABLE "public"."promo_price" OWNER TO "postgres";


ALTER TABLE "public"."promo_price" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."promo_price_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."sites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "pre_price" bigint,
    "status" boolean DEFAULT false,
    "in_system" boolean DEFAULT true
);


ALTER TABLE "public"."sites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "ticket_code" "text",
    "provider_ticket_code" "text",
    "status" "text" DEFAULT 'unused'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "order_code" "text",
    "site_code" "text",
    "product_name" "text",
    "product_code" "text",
    "ticket_number" "text",
    "valid_date_from" "text",
    "valid_date_to" "text"
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."topups" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "amount" numeric(12,2) NOT NULL,
    "payment_code" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "confirmed_at" timestamp with time zone,
    "real_amount" numeric,
    "updated_at" "date"
);


ALTER TABLE "public"."topups" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."topups_with_profiles" WITH ("security_invoker"='on') AS
 SELECT "p"."user_id",
    "p"."balance",
    "p"."username",
    "p"."email",
    "t"."id" AS "topup_id",
    "t"."amount",
    "t"."status",
    "t"."payment_code",
    "t"."created_at"
   FROM ("public"."profiles" "p"
     JOIN "public"."topups" "t" ON (("p"."user_id" = "t"."user_id")));


ALTER VIEW "public"."topups_with_profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."view_sale_history" AS
 SELECT "o"."id" AS "order_id",
    "o"."user_id",
    "o"."order_code",
    "o"."reference_code",
    "o"."status",
    "o"."site_code",
    "o"."created_at",
    "o"."total_amount",
    "o"."payment_method",
    "o"."payment_code",
    "o"."user_email",
    "o"."phone",
    "o"."status_payment",
    "o"."description",
    "o"."third_party_number",
    "oi"."id" AS "order_item_id",
    "oi"."product_code",
    "oi"."product_name",
    "oi"."quantity",
    "oi"."price",
    "oi"."date_use",
    (("oi"."quantity")::numeric * "oi"."price") AS "total"
   FROM ("public"."orders" "o"
     JOIN "public"."order_items" "oi" ON (("oi"."order_id" = "o"."id")));


ALTER VIEW "public"."view_sale_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallet_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "type" "text" NOT NULL,
    "order_id" "uuid",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wallet_transactions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."agent_prices"
    ADD CONSTRAINT "agent_prices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agents"
    ADD CONSTRAINT "agents_agent_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."agents"
    ADD CONSTRAINT "agents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."category"
    ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sites"
    ADD CONSTRAINT "locations_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."sites"
    ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_payment_code_key" UNIQUE ("payment_code");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."promo"
    ADD CONSTRAINT "promo_pkey" PRIMARY KEY ("code");



ALTER TABLE ONLY "public"."promo_price"
    ADD CONSTRAINT "promo_price_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."topups"
    ADD CONSTRAINT "topups_payment_code_key" UNIQUE ("payment_code");



ALTER TABLE ONLY "public"."topups"
    ADD CONSTRAINT "topups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_wallets_transaction_created_at" ON "public"."wallet_transactions" USING "btree" ("created_at");



CREATE INDEX "profiles_role_idx" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "profiles_status_idx" ON "public"."profiles" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "profiles_set_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."agent_prices"
    ADD CONSTRAINT "agent_prices_agent_code_fkey" FOREIGN KEY ("agent_code") REFERENCES "public"."agents"("code");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_personType_fkey" FOREIGN KEY ("personType") REFERENCES "public"."category"("code");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_site_code_fkey" FOREIGN KEY ("site_code") REFERENCES "public"."sites"("code");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_agent_level_fkey" FOREIGN KEY ("agent_level") REFERENCES "public"."agents"("code");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."promo_price"
    ADD CONSTRAINT "promo_price_product_code_fkey" FOREIGN KEY ("product_code") REFERENCES "public"."products"("code");



ALTER TABLE ONLY "public"."promo_price"
    ADD CONSTRAINT "promo_price_promo_code_fkey" FOREIGN KEY ("promo_code") REFERENCES "public"."promo"("code");



ALTER TABLE ONLY "public"."promo"
    ADD CONSTRAINT "promo_site_code_fkey" FOREIGN KEY ("site_code") REFERENCES "public"."sites"("code");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."topups"
    ADD CONSTRAINT "topups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."wallet_transactions"
    ADD CONSTRAINT "wallet_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id");



CREATE POLICY "Allow insert for authenticated users" ON "public"."agent_prices" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow update for authenticated users" ON "public"."agent_prices" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Users can view locations" ON "public"."sites" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view promos" ON "public"."agent_prices" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view promos" ON "public"."agents" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view promos" ON "public"."category" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view topups" ON "public"."topups" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "admin full access" ON "public"."topups" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."user_id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"public"."user_role")))));



ALTER TABLE "public"."agent_prices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."agents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."category" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_insert_own" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "profiles_read_own" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."promo" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."promo_price" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public can read agent_prices" ON "public"."agent_prices" FOR SELECT TO "anon" USING (true);



CREATE POLICY "public can read category" ON "public"."category" FOR SELECT TO "anon" USING (true);



CREATE POLICY "public can read locations" ON "public"."sites" FOR SELECT TO "anon" USING (true);



CREATE POLICY "public can read orders" ON "public"."orders" FOR SELECT TO "anon" USING (true);



CREATE POLICY "public can read topups" ON "public"."topups" FOR SELECT TO "anon" USING (true);



CREATE POLICY "read own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."sites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."topups" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "user can insert own topup" ON "public"."topups" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "user view own topups" ON "public"."topups" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."wallet_transactions" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."approve_topup"("topup_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."approve_topup"("topup_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."approve_topup"("topup_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."complete_order"("p_order_id" "uuid", "p_provider_order_code" "text", "p_tickets" "jsonb", "p_reference_code" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."complete_order"("p_order_id" "uuid", "p_provider_order_code" "text", "p_tickets" "jsonb", "p_reference_code" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."complete_order"("p_order_id" "uuid", "p_provider_order_code" "text", "p_tickets" "jsonb", "p_reference_code" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."complete_order_customer"("p_order_id" "uuid", "p_provider_order_code" "text", "p_reference_code" "text", "p_tickets" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."complete_order_customer"("p_order_id" "uuid", "p_provider_order_code" "text", "p_reference_code" "text", "p_tickets" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."complete_order_customer"("p_order_id" "uuid", "p_provider_order_code" "text", "p_reference_code" "text", "p_tickets" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_order_pending"("p_user_id" "uuid", "p_list_ticket_submit" "jsonb", "p_total_amount" numeric, "p_user_email" "text", "p_date_use" "date", "p_order_des" "text", "p_payment_method" "text", "p_side_code" "text", "p_third_party_num" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_order_pending"("p_user_id" "uuid", "p_list_ticket_submit" "jsonb", "p_total_amount" numeric, "p_user_email" "text", "p_date_use" "date", "p_order_des" "text", "p_payment_method" "text", "p_side_code" "text", "p_third_party_num" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_order_pending"("p_user_id" "uuid", "p_list_ticket_submit" "jsonb", "p_total_amount" numeric, "p_user_email" "text", "p_date_use" "date", "p_order_des" "text", "p_payment_method" "text", "p_side_code" "text", "p_third_party_num" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."customer_buy_ticket"("c_total_amount" numeric, "c_user_email" "text", "c_phone" "text", "c_fullname" "text", "c_payment_code" "text", "c_site_code" "text", "c_third_party_num" "text", "c_date_use" "date", "c_order_code" "text", "list_ticket_submit" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."customer_buy_ticket"("c_total_amount" numeric, "c_user_email" "text", "c_phone" "text", "c_fullname" "text", "c_payment_code" "text", "c_site_code" "text", "c_third_party_num" "text", "c_date_use" "date", "c_order_code" "text", "list_ticket_submit" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."customer_buy_ticket"("c_total_amount" numeric, "c_user_email" "text", "c_phone" "text", "c_fullname" "text", "c_payment_code" "text", "c_site_code" "text", "c_third_party_num" "text", "c_date_use" "date", "c_order_code" "text", "list_ticket_submit" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_agent_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_agent_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_agent_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone, "p_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_sale_summary"("p_start" timestamp with time zone, "p_end" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_topup_webhook"("payment_code_transf" "text", "amount_to_add" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."handle_topup_webhook"("payment_code_transf" "text", "amount_to_add" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_topup_webhook"("payment_code_transf" "text", "amount_to_add" numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."agent_prices" TO "anon";
GRANT ALL ON TABLE "public"."agent_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."agent_prices" TO "service_role";



GRANT ALL ON TABLE "public"."agents" TO "anon";
GRANT ALL ON TABLE "public"."agents" TO "authenticated";
GRANT ALL ON TABLE "public"."agents" TO "service_role";



GRANT ALL ON TABLE "public"."category" TO "anon";
GRANT ALL ON TABLE "public"."category" TO "authenticated";
GRANT ALL ON TABLE "public"."category" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."promo" TO "anon";
GRANT ALL ON TABLE "public"."promo" TO "authenticated";
GRANT ALL ON TABLE "public"."promo" TO "service_role";



GRANT ALL ON TABLE "public"."promo_price" TO "anon";
GRANT ALL ON TABLE "public"."promo_price" TO "authenticated";
GRANT ALL ON TABLE "public"."promo_price" TO "service_role";



GRANT ALL ON SEQUENCE "public"."promo_price_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."promo_price_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."promo_price_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."sites" TO "anon";
GRANT ALL ON TABLE "public"."sites" TO "authenticated";
GRANT ALL ON TABLE "public"."sites" TO "service_role";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";



GRANT ALL ON TABLE "public"."topups" TO "anon";
GRANT ALL ON TABLE "public"."topups" TO "authenticated";
GRANT ALL ON TABLE "public"."topups" TO "service_role";



GRANT ALL ON TABLE "public"."topups_with_profiles" TO "anon";
GRANT ALL ON TABLE "public"."topups_with_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."topups_with_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."view_sale_history" TO "anon";
GRANT ALL ON TABLE "public"."view_sale_history" TO "authenticated";
GRANT ALL ON TABLE "public"."view_sale_history" TO "service_role";



GRANT ALL ON TABLE "public"."wallet_transactions" TO "anon";
GRANT ALL ON TABLE "public"."wallet_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet_transactions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







