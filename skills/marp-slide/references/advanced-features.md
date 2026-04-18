# Marp Advanced Features Reference

## Fragmented List (Progressive Display)

### Basic Usage
```markdown
* Item 1
* Item 2
* Item 3
```

Use `*` instead of `-` for fragmented lists (reveal items one by one in presenter mode).

### Using Asterisks (*)
```markdown
* First point revealed
* Second point revealed
* Third point revealed
```

### Important Notes
- Fragmented lists only work in HTML export with presenter mode
- In PDF export, all items appear at once
- VS Code preview shows all items simultaneously

## Math Notation (Marp Core Extension)

### Inline Math
```markdown
$E = mc^2$

The formula $\sum_{i=1}^{n} x_i$ represents the sum.
```

### Block Math
```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### Multi-line Math
```markdown
$$
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}
$$
```

### Math Examples
```markdown
## Mathematical Formulas

Pythagorean theorem: $a^2 + b^2 = c^2$

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Important Notes
- Requires Marp Core (not available in basic Marpit)
- Uses KaTeX for rendering
- Some complex expressions may not render

## Emoji (Marp Core Extension)

### Usage
```markdown
:smile: :+1: :sparkles: :rocket: :fire:
```

### Common Emoji
- `:check:` ✅
- `:x:` ❌
- `:warning:` ⚠️
- `:bulb:` 💡
- `:star:` ⭐
- `:trophy:` 🏆

### Emoji List
Supports all GitHub Emoji. Full list: https://github.com/ikatyang/emoji-cheat-sheet

## Auto-scaling

Marp automatically scales content to fit the slide.

### Disable
```markdown
---
marp: true
---

<style>
section {
  font-size: 20px; /* Fixed font size */
}
</style>
```

## Using HTML Tags

HTML is supported in Marp (must be enabled in VS Code settings).

### Alignment Control
```markdown
<div style="text-align: center;">
  Centered text
</div>

<div style="text-align: right;">
  Right-aligned text
</div>
```

### Two-Column Layout
```markdown
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
<div>

**Left Column**
- Point A
- Point B

</div>
<div>

**Right Column**
- Point C
- Point D

</div>
</div>
```

### Styled Box
```markdown
<div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #1976d2;">

**Important note:** This is highlighted content.

</div>
```

## Marp CLI Detailed Options

### Basic Commands
```bash
# Install
npm install -g @marp-team/marp-cli

# HTML output
marp slides.md

# PDF output
marp --pdf slides.md

# Image output (PNG)
marp --images png slides.md
```

### Watch Mode
```bash
# Auto-regenerate on file changes
marp --watch slides.md
```

### Specify Theme
```bash
# Use custom theme CSS
marp --theme custom-theme.css slides.md

# Use theme name
marp --theme gaia slides.md
```

### Batch Convert Multiple Files
```bash
# Convert all .md files in directory
marp --pdf *.md

# Recursive
marp --pdf **/*.md
```

### HTML Output Options
```bash
# Enable HTML tags
marp --html slides.md

# With presenter notes
marp --html --allow-local-files slides.md
```

### PDF Output Options
```bash
# A4 size
marp --pdf --size A4 slides.md

# 4:3 ratio
marp --pdf --size 4:3 slides.md
```

### Image Output
```bash
# PNG (one per slide)
marp --images png slides.md

# JPEG
marp --images jpeg slides.md

# Specific page only
marp --image png --page 1 slides.md
```

## Marp for VS Code

### Enable
1. Install "Marp for VS Code" extension
2. Open `.md` file
3. Enable Marp in frontmatter: `marp: true`

### Preview
- Click preview button (top right) or `Ctrl+Shift+V`
- Slides render in real-time

### Export
- Command Palette: `Marp: Export Slide Deck`
- Supports HTML, PDF, PNG, JPEG, PPTX

### Settings
```json
{
  "markdown.marp.enableHtml": true,
  "markdown.marp.themes": ["./custom-theme.css"],
  "markdown.marp.pdf.outDir": "./output"
}
```

## Automated Build with GitHub Actions

### Basic Workflow
```yaml
name: Build Slides

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build slides
        uses: marp-team/marp-action@v2
        with:
          input: slides.md
          output: slides.pdf
```

### Publish to GitHub Pages
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./output
```

## Tips & Tricks

### 1. Customize Slide Numbers
```markdown
---
marp: true
paginate: true
---

<style>
section::after {
  font-size: 0.6em;
  content: attr(data-marpit-pagination) '/' attr(data-marpit-pagination-total);
}
</style>
```

### 2. Gradient Background
```markdown
<!-- _backgroundColor: "linear-gradient(135deg, #667eea, #764ba2)" -->
<!-- _color: white -->

# Gradient Slide
```

### 3. Two-Column Layout
```markdown
<div style="display: flex; gap: 40px;">
<div style="flex: 1;">

## Left Column
Content here

</div>
<div style="flex: 1;">

## Right Column
Content here

</div>
</div>
```

### 4. Progress Bar
```markdown
<style>
section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: calc(attr(data-marpit-pagination) / attr(data-marpit-pagination-total) * 100%);
  height: 4px;
  background: #3b82f6;
}
</style>
```

## Troubleshooting

### PDF Not Generated
- Check Node.js version (requires 16+)
- Reinstall: `npm install -g @marp-team/marp-cli`
- Try with `--allow-local-files` flag

### Fonts Not Displaying
- Ensure internet connection for Google Fonts
- Use `--allow-local-files` for local fonts
- Embed font as base64 in CSS

### Images Not Displaying
- Check relative path from markdown file
- Use `--allow-local-files` for local images
- Verify file extension matches (case-sensitive on Linux)

## Official References
- **Marp CLI**: https://github.com/marp-team/marp-cli
- **Marp Core**: https://github.com/marp-team/marp-core
- **Marp for VS Code**: https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode
- **Marpit Documentation**: https://marpit.marp.app/
