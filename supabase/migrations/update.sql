ALTER TABLE order_items
ADD COLUMN product_code TEXT,
ADD COLUMN product_name TEXT;


CREATE OR REPLACE FUNCTION create_order_pending(
  p_user_id uuid,
  p_list_ticket_submit jsonb,
  p_total_amount numeric,
  p_user_email text,
  p_date_use date,
  p_order_des text,
  p_payment_method text,
  p_side_code text
)
RETURNS jsonb
LANGUAGE plpgsql
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
    site_code
  )
  VALUES (
    p_user_id,
    p_total_amount,
    'pending',
    p_order_des,
    p_payment_method,
    p_user_email,
    now(),
    p_side_code
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





ALTER TABLE orders
ADD COLUMN reference_code TEXT;


ALTER TABLE tickets
ADD COLUMN order_code TEXT,
ADD COLUMN site_code TEXT,
ADD COLUMN product_mame TEXT,
ADD COLUMN product_code TEXT,
ADD COLUMN ticket_number TEXT,
ADD COLUMN valid_date_from TEXT;










CREATE OR REPLACE FUNCTION complete_order(
  p_order_id uuid,
  p_provider_order_code text,
  p_tickets jsonb,
  p_reference_code text
)
RETURNS jsonb
LANGUAGE plpgsql
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
  product_mame,
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






ALTER TABLE orders
ADD COLUMN site_code TEXT;

DROP VIEW IF EXISTS public.view_sale_history;

CREATE OR REPLACE VIEW public.view_sale_history AS
SELECT
  o.id AS order_id,
  o.user_id,
  o.created_at,
  o.order_code,
  o.reference_code,
  o.status,
  o.site_code,

  oi.product_code,
  oi.product_name,
  oi.quantity,
  oi.price,
  (oi.quantity * oi.price) AS total

FROM orders o
INNER JOIN order_items oi
  ON oi.order_id = o.id

LEFT JOIN (
  SELECT DISTINCT
    order_id,
    site_code
  FROM tickets
) t
  ON t.order_id = o.id