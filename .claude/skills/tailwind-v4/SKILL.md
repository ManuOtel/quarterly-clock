---
name: tailwind-v4
description: Tailwind CSS v4 syntax standards and best practices. Use when writing or reviewing Tailwind classes.
---

# Tailwind CSS v4 Standards

## Gradient Syntax

- ALWAYS use `bg-linear-to-{dir}` instead of `bg-gradient-to-{dir}`.
  - Incorrect: `bg-gradient-to-r`
  - Correct: `bg-linear-to-r`

---

## Flex Utilities

- Use `grow` instead of `flex-grow`.
- Use `shrink-0` instead of `flex-shrink-0`.

---

## Transform Utilities

- Use `-translate-x-full` instead of `translate-x-[-100%]`.
- Use `translate-x-full` instead of `translate-x-[100%]`.

---

## Arbitrary Values

- Use semantic utilities when available.
  - `h-px` instead of `h-[1px]`
  - `/3` instead of `/[0.03]` (for opacity)

---

## Best Practices

- Do not use `hidden` and `flex` on the same element unless using responsive modifiers (e.g., `hidden md:flex` is OK, `hidden flex` is not).
