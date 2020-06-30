SELECT
  *
FROM
  all_tickets
WHERE
  guest ILIKE concat('%', $1, '%')
  OR guest ILIKE concat($1, '%')
  OR guest ILIKE concat('%', $1)
ORDER BY
  LENGTH(regexp_replace(guest, concat($1, '{1}'), '', 'i'));