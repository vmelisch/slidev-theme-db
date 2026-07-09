---
theme: ../
title: JSON in SQL — Week 8
layout: cover
---

# Week 8: JSON in SQL

Practical Course: SQL, Summer Semester 2026

---
layout: two-cols-header
columns: 55fr 45fr
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTl } from 'slidev-addon-gsap'

const tl = useTl()
onMounted(() => {
  tl.step()                        // step 0 — only the slide title is shown
    .fadeIn('.g-blocks')
    .step()                        // click 1 → "JSON building blocks"
    .fadeIn('.g-code')
    .step()                        // click 2 → the JSON example
    .fadeIn('.g-idea')
    .step()                        // click 3 → "Idea"
})
</script>

# Introduction to JSON

::left::

<div class="g-blocks">

## JSON building blocks

- Object: unordered key-value pairs
  > *e.g.,* `{json} {"name": "Daniel Krueger", "salary": 4867}`
- Array: ordered list of values
  > *e.g.,* `{json} ["Python", "SQL", "C++"]`
- Values can be: string, number, `null`, object, array

</div>

<div class="g-code">

```json {lines:true}
{
  "name": "Daniel Krueger",
  "salary": 4867,
  "city": "Dresden",
  "performance": {
    "rating": 4, "projects": 7, "reviews": 12
  },
  "skills": ["Python", "SQL", "C++"]
}
```

</div>

::right::

<div class="g-idea">

## Idea

- Relational tables need a fixed schema i.e. every row has the same columns
- Some data is semi-structured e.g., some employees have many skills, some don't
- JSON allows to store a flexible document inside a single column

<div class="db-statement">JSON support is varying by database vendors!</div>

</div>

---
layout: two-cols-header
columns: 65fr 35fr
---

# JSON in PostgreSQL

::left::

## How is JSON stored?

- As a column value: One JSON document per row
- PostgreSQL offers two types: `json` and `jsonb`

## Performance

- `jsonb` reads are faster
  - no repeated parsing + supports indexes (e.g., GIN)
- `json` writes are faster
  - stores original text as-is → less processing during insert/update

→ Use `jsonb` by default (focus of this lecture)

::right::

<div class="table-equal">

| id | profile |
|:-:|:-:|
| 1  | `{json} {"name":"Daniel Krueger", "salary": 4867, ...}` |
| 2  | `{json} {"name":"Sofia Weber", "salary": 6074, ...}` |
| 3  | `{json} {"name":"Lukas Brandt", "salary": 3854, ...}` |
| 4  | `{json} {"name":"Amelie Fischer", "salary": 5291, ...}` |

[Tab. 1: Employees]{.table-footer}

|           | json                    | jsonb                     |
|:-:|:-:|:-:|
| Storage   | Raw text                | Parsed binary structure   |
| Access    | Re-parses <br> text every time | Reads pre-parsed structure |
| Indexable | No                      | Yes                       |
| Operators | Limited                 | Full set                  |

[Tab. 2: json vs. jsonb]{.table-footer}

</div>

---
layout: two-cols-grid
columns: 55fr 45fr
codeSize: 10px
---

# Access Operators (1)

::grid::

<div class="c1">

## Simple Access

- Accessing individual JSON fields
  - `{sql} ->` returns `jsonb` (keeps JSON typing)
  - `{sql} ->>` returns `text` (plain value)

```sql {lines:true}
SELECT
  profile ->  'city' AS arrow1   -- "Dresden" (jsonb)
  profile ->> 'city' AS arrow2   -- Dresden (text)
FROM employees WHERE id = 1;
```

</div>

<div class="self-center c2">

| id | profile |
|:-:|:-:|
| 1 | `{json} {"name":"Daniel Krueger", "salary": 4867, ...}` |
| 2 | `{json} {"name":"Sofia Weber", "salary": 6074, ...}` |
| 3 | `{json} {"name":"Lukas Brandt", "salary": 3854, ...}` |
| 4 | `{json} {"name":"Amelie Fischer", "salary": 5291, ...}` |

</div>

<div class="c3">

## Usage in `WHERE`

- Typically "`->>`" for string comparisons

```sql {lines:true}
SELECT
  profile ->> 'name'   AS name
  profile ->> 'salary' AS salary
FROM employees
WHERE profile ->> 'name' = 'Amelie Fischer';
```

</div>

<div class="c4">

## Casting values

- Use `{sql} ::int` to cast text to integers
- Needed for numeric `ORDER BY`, `AVG`, `>`, …

```sql {lines:true}
SELECT SUM((profile ->> 'salary')::int)
FROM employees;
```

</div>

---
layout: two-cols-header
columns: 55fr 45fr
---

# Access Operators (2)

::left::

## Path Access

- For nested access, two styles
  - Chain: `{sql} profile -> 'performance' ->> 'reviews'`
  - Path: `{sql} profile #>> '{performance,reviews}'`
- Are more concise for deep nesting

## Summary

- The 4 access operators

|              | Returns `jsonb` | returns `text` |
|:------------:|:---------------:|:--------------:|
| by key/index | `{sql} ->`      | `{sql} ->>`    |
| by path      | `{sql} #>`      | `{sql} #>>`    |

::right::

```json {lines:true}
{
  "name": "Daniel Krueger",
  "salary": 4867,
  "city": "Dresden",
  "performance": {
    "rating": 4, "projects": 7, "reviews": 12
  },
  "skills": ["Python", "SQL", "C++"]
}
```

---
layout: two-cols-header
columns: 52fr 48fr
---

# Existence Operators (1)

::left::

## Containment `@>`

- "Does the left side contain the right side"
  - On an object: e.g., all employees living in Berlin
  ```sql {lines:true}
  SELECT profile -> 'name' AS name
  FROM employees
  WHERE profile @> '{"city": "Berlin"}';
  ```

  - On an array: e.g., all who speak Python AND SQL
  ```sql {lines:true}
  SELECT profile -> 'name' AS name
  FROM employees
  WHERE profile -> 'skills' @> '["Python", "SQL"]';
  ```

::right::

<div class="table-reach e-table" style="--reach: 70px">

| id | profile |
|:-:|:-:|
| 1 | `{json} {"name":"Daniel Krueger", "city": "Dresden", ...}` |
| 2 | `{json} {"name":"Sofia Weber", "city": "Berlin", ...}` |
| 3 | `{json} {"name":"Lukas Brandt", "city": "Munich", ...}` |
| 4 | `{json} {"name":"Amelie Fischer", "city": "Berlin", ...}` |

</div>


---
layout: default
---

# Unnesting functions (1)

<div class="u-moti">

## Motivation

- So far: Scalar field access e.g., `{sql} profile -> 'name'`
- What about accessing arrays?
  > e.g., counting the skills per employee (`{json} "skills": ["Python", "SQL", "C++"]`)
- … or objects with dynamic keys?
  > e.g., listing performance per employee (`{json} "performance": {"rating": 4, "projects": 7, "reviews": 12}`)

</div>

<div class="u-prob">

--> Problem: A fixed-key `{sql} ->>` can't iterate over unknown/variable contents

</div>

<div class="u-sol">

--> Solution: Turn multi-element JSON structures into rows

</div>

---
layout: default
---

# Code features — line numbers & highlighting

## Step through with clicks

```sql {1|2|3|all}{lines:true}
SELECT name, data ->> 'city' AS city
FROM employees
WHERE (data ->> 'salary')::int > 4000
ORDER BY city;
```

Each click highlights the next line (`{1|2|3|all}`); `{lines:true}` adds the numbers.

---
layout: default
---

# Live code — Monaco editor

Editable & runnable JavaScript (`{monaco-run}`):

```js {monaco-run}
const profile = { name: "Daniel Krueger", skills: ["Python", "SQL", "C++"] }
console.log("skill count:", profile.skills.length)
console.log("first skill:", profile.skills[0])
```
