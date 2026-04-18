# Marp Official Themes Reference

Marp provides three official built-in themes.

## Official Theme List

| Theme | Style | Use Case |
|-------|-------|----------|
| `default` | Clean, beige background | General presentations |
| `gaia` | Bold, dark accent | Modern, striking slides |
| `uncover` | Minimal, white | Clean academic-style |

## Default Theme

**Features**: Clean presentation style, footer bar
**Colors**: Light background, blue headings

### Usage
```markdown
---
marp: true
theme: default
---
```

### Available Classes
- `lead` - Center-aligned title slide
- `invert` - Inverted colors

### Customization Example
```markdown
<style>
section {
  background: #f5f5f5;
}
</style>
```

## Gaia Theme

**Features**: Strong color contrast, bold design
**Colors**: Dark background variations

### Usage
```markdown
---
marp: true
theme: gaia
---
```

### Color Variations
Apply via `class` directive:
- Default: Dark purple
- `gaia` class: Teal accent

### Distinctive Styles
- Inverted color sections
- High-contrast headings

## Uncover Theme

**Features**: Minimal, spotlight-style
**Colors**: White/light backgrounds

### Usage
```markdown
---
marp: true
theme: uncover
---
```

### Available Classes
- `lead` - Large centered text
- `invert` - Inverted colors

## Theme Comparison Table

| Feature | default | gaia | uncover |
|---------|---------|------|---------|
| Background | Light | Dark | White |
| Style | Classic | Bold | Minimal |
| Footer bar | Yes | No | No |
| Best for | General | Tech/Modern | Academic |

## Common Class Specifications

### lead
```markdown
<!-- _class: lead -->

# Title (centered, large)
```

### invert
```markdown
<!-- _class: invert -->

## Inverted color slide
```

## Theme Selection Guidelines

### When to Choose default
- General business presentations
- Training materials
- Mixed audiences

### When to Choose gaia
- Tech talks
- Modern, bold statements
- Dark-preferred environments

### When to Choose uncover
- Academic presentations
- Minimal, content-first slides
- Clean impression needed

## Official References
- **Marp Themes**: https://github.com/marp-team/marp-core/tree/main/themes
- **Marp Official Site**: https://marp.app/
