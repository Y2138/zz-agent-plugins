# Final Checklist

Load this file only right before producing the final prompt package.

Do not load it during the early clarification rounds unless the conversation is already at the final confirmation stage.

## Purpose

This checklist is the last gate before output. Its job is to prevent premature prompt generation when critical image requirements are still missing.

## Required Check Fields

Review whether these fields are sufficiently clear:

- subject
- scene
- style
- composition
- lighting or mood
- output use case
- aspect ratio or orientation
- constraints

## Decision Rule

- if 6 or more fields are sufficiently clear, the prompt may proceed to final packaging
- if fewer than 6 fields are clear, ask more questions
- if a critical field is missing for the user's specific goal, ask again even when the total count is already high

## Critical-Field Rules

Examples:

- wallpaper or banner requests require orientation or aspect ratio
- poster requests require text vs no-text confirmation
- product, object, or character requests require precise subject clarity
- image-to-prompt requests require preservation priorities
- marketing or ad requests usually require composition focus and delivery intent

## If The Gate Fails

Do not output the final prompt package yet.

Use a follow-up like:

```text
我先不急着出最终提示词，目前还缺少会明显影响结果的信息：
- [missing field 1]
- [missing field 2]

我再确认一下：[next best question]
```

Ask only the next highest-value question. Do not dump a long questionnaire all at once.

## If The Gate Passes

Use a short transition like:

```text
关键信息已经完整，可以整理最终生图提示词了。
```

Then output the final package using the language policy from `SKILL.md`.
