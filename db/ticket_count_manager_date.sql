SELECT
  date_trunc('day', created) AS created,
  COUNT(*) filter (
    WHERE
      status_lifecycle = 'new'
  ) AS new_count,
  COUNT(*) filter (
    WHERE
      status_lifecycle = 'queued'
  ) AS queued_count,
  COUNT(*) filter (
    WHERE
      status_lifecycle = 'accepted'
  ) AS accepted_count,
  COUNT(*) filter (
    WHERE
      status_lifecycle = 'disposed'
  ) AS disposed_count,
  COUNT(*) filter (
    WHERE
      status_lifecycle = 'closed'
  ) AS closed_count,
  COUNT(*) filter (
    WHERE
      status_lifecycle = 'sold'
  ) AS sold_count,
  COUNT(*) filter (
    WHERE
      status_lifecycle = 'archived'
  ) AS archived_count,
  COUNT(*) filter (
    WHERE
      type_id = 1
  ) AS finance_count,
  COUNT(*) filter (
    WHERE
      type_id = 2
  ) AS cash_count,
  COUNT(*) filter (
    WHERE
      type_id = 3
  ) AS osf_count,
  SUM(type_weight) AS weighted_total,
  COUNT(*) AS total_count
FROM
  all_tickets
WHERE
  manager_id = $1
GROUP BY
  created;