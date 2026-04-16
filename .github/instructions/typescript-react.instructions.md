# TypeScript React Code Generation Instructions

## Scope

These instructions apply when generating or modifying code in this React + TypeScript project.

## Stack and Architecture

- Use React with TypeScript.
- Keep TypeScript strict and explicit. Prefer clear domain types over `any`, unsafe casts, or implicit behavior.
- Write code as a senior React architect: simple structure, clear responsibilities, low coupling, and readable components.
- Prefer composition over premature abstraction.
- Keep components focused and easy to test.

## React Rules

- Use idiomatic React patterns.
- Prefer functional components.
- Keep state as local as possible.
- Do not introduce global state management unless it is clearly required.
- Do not add Redux.
- Do not add extra libraries for state, forms, styling, data fetching, or utilities without asking first.
- Before introducing a new dependency, justify why the existing stack is insufficient.

## UI Rules

- Use Material UI (`@mui/material` and related MUI packages already present in the project) for controls and common UI elements whenever possible.
- Prefer MUI components for buttons, inputs, dialogs, lists, cards, layout primitives, feedback, and navigation.
- Only build custom controls when MUI does not provide a suitable option.
- Keep the UI consistent with the existing MUI-based design language.

## TypeScript Rules

- Define reusable types and interfaces in the appropriate domain files.
- Avoid `any`.
- Prefer narrow types, discriminated unions, and explicit return types when they improve clarity.
- Validate nullable and optional values explicitly.
- Keep utility functions pure when possible.

## Clean Code Rules

- Use descriptive names.
- Keep functions short and focused.
- Avoid duplicated logic.
- Extract helpers only when reuse or clarity justifies it.
- Do not over-engineer.
- Add comments only when they explain non-obvious intent.

## Security and Configuration

- Never hardcode secrets, API keys, tokens, passwords, or credentials.
- Use environment variables or existing configuration mechanisms.
- If a secret seems required, ask for the proper configuration path instead of embedding it in code.

## Delivery Style

- Be concise in generated explanations.
- Do not include step-by-step narrative unless explicitly requested.
- Focus on the implementation and the result.
