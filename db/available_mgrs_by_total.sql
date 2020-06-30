refresh materialized VIEW concurrently available_managers;

SELECT
  *
FROM
  available_managers
ORDER BY
  total_count;