CREATE OR REPLACE FUNCTION get_due_challenge_nudges()
RETURNS TABLE(user_id UUID, current_day INT)
LANGUAGE sql SECURITY DEFINER
AS $body$
  SELECT e.user_id, e.current_day
  FROM challenge_enrollments e
  WHERE e.status = 'active'
    AND e.notification_time IS NOT NULL
    AND e.notification_days IS NOT NULL
    AND TO_CHAR(NOW() AT TIME ZONE COALESCE(e.timezone, 'UTC'), 'HH24:MI') = e.notification_time
    AND EXTRACT(DOW FROM NOW() AT TIME ZONE COALESCE(e.timezone, 'UTC'))::INT
        = ANY(ARRAY(SELECT jsonb_array_elements_text(e.notification_days))::INT[])
    AND (
      e.last_nudge_sent_at IS NULL
      OR (e.last_nudge_sent_at AT TIME ZONE COALESCE(e.timezone, 'UTC'))::DATE
         < (NOW() AT TIME ZONE COALESCE(e.timezone, 'UTC'))::DATE
    );
$body$;
