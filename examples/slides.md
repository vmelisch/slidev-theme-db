---
theme: db
layout: cover
---

# Week 8: JSON in SQL

Practical Course: SQL, Summer Semester 2026

---
layout: two-cols-header
columns: 55fr 45fr
---

# Introduction to JSON

::left::

## JSON building blocks

- Object: unordered key-value pairs
  - *e.g.,* `{json} {"name": "Daniel Krueger", "salary": 4867}`
- Values can be: string, number, `null`, object, array

::right::

[Tab. 1: Employees]{.table-caption}

| id | name |
|:--:|:-----|
| 1  | Daniel Krueger |
| 2  | Sofia Weber |

---
layout: default
---

# Access operators

- `{sql} ->` returns `jsonb`, `{sql} ->>` returns `text`

```sql {1|2|all}{lines:true}
SELECT profile ->> 'city' AS city
FROM employees
WHERE (profile ->> 'salary')::int > 4000;
```
