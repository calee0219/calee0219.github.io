# Chia-An Lee's Personal Website

[![Deploy to GitHub Pages](https://github.com/calee0219/calee0219.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/calee0219/calee0219.github.io/actions/workflows/deploy.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c11943eb-ef6a-40d1-bb10-49450273e165/deploy-status)](https://app.netlify.com/projects/vigilant-lumiere-7107af/deploys)

This repository contains the source code for my personal website and blog, built with [Hugo](https://gohugo.io/) and the [HugoBlox](https://hugoblox.com/) framework.

🌐 **Live Site:** [https://calee0219.github.io/](https://calee0219.github.io/)

## About Me

I am Chia-An Lee, a Production Engineer at Meta and a former Master's student in Computer Science at National Yang Ming Chiao Tung University (NYCU). My interests include infrastructure, traditional networking, and mobile networking. I previously worked on developing the open-source 5G core network [free5GC](https://free5gc.org/).

## Repository Structure

- `content/`: Markdown files for the website content
  - `_index.md`: Homepage layout blocks
  - `blog/`: Technical articles, travel logs, and personal thoughts
  - `experience.md`: Work experience and education timeline
  - `projects/`: Project showcases
  - `publications/`: Academic papers and presentations
- `data/authors/calee.yaml`: My profile, bio, skills, and experience data
- `config/_default/`: Hugo configuration files (site settings, menus, languages)
- `static/`: Static assets like PDFs and images
- `assets/media/`: Site icons and avatars

## Local Development

To run this site locally, you'll need to install [Hugo](https://gohugo.io/getting-started/installing/) (extended version) and [Node.js/pnpm](https://pnpm.io/installation).

1. Clone the repository:
   ```bash
   git clone https://github.com/calee0219/calee0219.github.io.git
   cd calee0219.github.io
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the Hugo development server:
   ```bash
   hugo server
   ```

4. Open your browser and navigate to `http://localhost:1313`

## Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger the `.github/workflows/deploy.yml` workflow, which builds the Hugo site and publishes the `public/` directory.

## License

The content of this website is licensed under a [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://creativecommons.org/licenses/by-nc-nd/4.0/). The underlying HugoBlox theme is licensed under the MIT License.
