---
name: image-prompt-workflow
description: Use when the user wants to generate an image, refine a text-to-image prompt, expand a short idea like "sunrise" into a complete prompt, or infer a reusable prompt from a reference image. Ask concise follow-up questions, then output a structured prompt package with final prompt, negative prompt or avoid guidance, params, and assumptions.
---

# Image Prompt Workflow

Turn short image ideas into production-ready prompts for image models.

## Use This Skill When

Trigger for:

- text-to-image requests
- prompt refinement requests
- image-to-prompt requests
- short inputs like `日出`, `海报`, `做一张壁纸`

Do not use for code, UI implementation, or unrelated writing.

## Language Rule

Keep the whole interaction and final package in one language only.

- default to the user's language
- if the user writes in Chinese, use Chinese throughout
- if the user writes in English, use English throughout
- switch languages only if the user asks

## Minimal Workflow

1. Classify the request as `text-to-image`, `prompt refinement`, or `image-to-prompt`.
2. If the target model matters and is unknown, ask once. Otherwise stay model-neutral.
3. Check whether the request is clear enough across:
   - subject
   - scene
   - style
   - composition
   - lighting or mood
   - use case
   - aspect ratio or orientation
   - constraints
4. Ask only the highest-value missing questions.
5. Before final output, read `references/final-checklist.md`.
6. If the checklist passes, output the final package. If not, keep clarifying.

## Clarification Rules

- ask at most 5 rounds unless the user wants deeper exploration
- prefer 1 focused question at a time
- if the user says `你定` or equivalent, choose sensible defaults and mark them as assumptions
- stop asking as soon as the result is controllable enough to generate well

Useful priority:

1. use case and subject
2. style
3. scene
4. composition
5. lighting or mood
6. aspect ratio and constraints

For reusable question wording, read `references/question-templates.md` only when needed.

## Prompt Construction Rules

Write prompts in natural descriptive language, not noisy keyword piles.

Preferred order:

1. subject and action
2. scene
3. style
4. composition or viewpoint
5. lighting and color
6. materials or detail cues
7. output intent
8. constraints

Rules:

- use concrete visual details
- keep one coherent art direction
- include text instructions only when the user wants text in the image
- avoid fake precision about invisible details

## Image-to-Prompt Rules

For reference images:

- separate observed details from inferred details
- never claim exact recovery of the original prompt
- ask which traits matter most if a near match is needed

## Final Package

Choose one language only.

Chinese package:

```markdown
## 目标
[一句话目标概述]

## 最终提示词
[完整提示词段落]

## 负向限制
[负向提示词或简短规避项]

## 参数建议
- 模型: [...]
- 比例 / 尺寸: [...]
- 质量 / 风格化: [...]
- Seed 或变体建议: [...]

## 假设
- [...]
```

English package:

```markdown
## Prompt Goal
[one-line summary]

## Final Prompt
[full prompt paragraph]

## Negative Prompt / Avoid
[negative prompt or short avoid list]

## Suggested Params
- Model: [...]
- Aspect ratio / size: [...]
- Quality / stylization: [...]
- Seed or variation guidance: [...]

## Assumptions
- [...]
```

## References

Load only when needed:

- `references/question-templates.md`
- `references/prompt-research.md`

Load only right before final output:

- `references/final-checklist.md`
