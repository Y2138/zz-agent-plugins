# Prompt Research Notes

Research snapshot date: 2026-03-24

This file keeps the external research behind the skill so `SKILL.md` can stay lean.

## Core Findings

### 1. High-performing image prompts are structured, not merely longer

Across official and community sources, the strongest recurring pattern is:

- identify the subject clearly
- describe the environment or context
- specify style and medium
- guide composition or camera framing
- define lighting and color mood
- add output constraints such as aspect ratio or use case

This skill therefore treats missing visual dimensions as clarification targets rather than padding the prompt with random adjectives.

### 2. Natural language beats noisy keyword piles

Recent guidance from official model docs trends toward concise but concrete natural language. Short keyword bags can still work on some models, but they are harder to control and easier to overfit. The safest default is a coherent descriptive sentence or paragraph.

### 3. Negative guidance should be selective

Community prompting practice still finds value in negative prompts for some diffusion-style models, especially for anatomy, duplication, blur, and watermark artifacts. But not every model uses them equally well. The skill therefore outputs either:

- `Negative Prompt`, or
- `Avoid` guidance when model support is weak or unspecified

### 4. Image-to-prompt is approximation, not forensic recovery

Describe-style and reverse-prompt workflows are best treated as reconstruction aids. They can capture composition, style, and mood, but they do not reveal the exact original prompt, seed, or full generation settings. The skill explicitly separates observed details from inferred ones.

### 5. Follow-up questions should focus on the highest-variance dimensions

The most meaningful clarifications are usually:

1. intended use
2. style or realism level
3. subject context
4. composition
5. aspect ratio

These choices change the output far more than late-stage embellishments.

## Practical Prompt Dimensions

Use these when expanding a short request:

| Dimension | Examples |
| --- | --- |
| Subject | sunrise, astronaut, perfume bottle, tea shop |
| Action / state | rising, floating, smiling, abandoned, stormy |
| Scene | beach, alpine lake, neon alley, tatami room |
| Style / medium | photo, anime cel, oil painting, voxel, editorial |
| Composition | close-up, wide shot, centered, asymmetrical, macro |
| Lens / viewpoint | 35mm eye-level, aerial, top-down, low angle |
| Light | golden hour, volumetric dusk, soft studio, overcast |
| Color | warm amber, desaturated blue-gray, pastel, neon cyan |
| Texture / detail | wet pavement, brushed metal, paper grain, mist |
| Constraints | no text, minimal background, empty foreground |
| Output intent | wallpaper, hero banner, poster, concept art |

## Image-to-Prompt Best Practices

When the user supplies a reference image:

- summarize only visible facts first
- ask which attributes must be preserved
- convert the image into reusable language, not exact metadata claims
- keep editable knobs separate so the user can iterate quickly

Useful preservation axes:

- subject identity
- art style
- color palette
- camera framing
- mood
- level of detail

## Source List

Official and primary sources:

- OpenAI Images guide: https://platform.openai.com/docs/guides/image-generation
- Amazon Nova image prompting guide: https://docs.aws.amazon.com/nova/latest/userguide/prompting-image-generation.html
- Midjourney docs: https://docs.midjourney.com/

Supplementary community and educational references:

- Learn Prompting: https://learnprompting.org/
- PromptHero prompt engineering resources: https://prompthero.com/

## How To Reuse These Notes

If the skill needs to evolve:

1. refresh official sources first
2. compare which prompt dimensions keep recurring
3. update the clarification checklist before adding new flourish words
4. keep the research file factual and keep `SKILL.md` procedural
