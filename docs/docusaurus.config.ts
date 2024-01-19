import {themes as prismThemes} from "prism-react-renderer"
import type {Config} from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

const config: Config = {
  title: "Definable",
  tagline: "Easily define and structure your Firebase Firestore database project with TypeScript classes.",
  favicon: "img/favicon.ico",
  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/definable/",
  organizationName: "janwuesten",
  projectName: "definable",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts"
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Definable",
      logo: {
        alt: "My Site Logo",
        src: "img/icon-512.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/janwuesten/definable",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs/intro",
            },
            {
              label: "Installation",
              to: "/docs/getting-started/installation",
            },
          ],
        },
        {
          title: "Support & Information",
          items: [
            {
              label: "Issues",
              href: "https://github.com/janwuesten/definable/issues",
            },
            {
              label: "Security Policy",
              href: "https://github.com/janwuesten/definable/security/policy",
            }
          ],
        },
        {
          title: "References",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/janwuesten/definable",
            },
            {
              label: "NPM",
              href: "https://www.npmjs.com/package/@janwuesten/definable",
            }
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "About me",
              href: "https://prevoid.eu/about",
            },
            {
              label: "Imprint",
              href: "https://prevoid.eu/legal/imprint",
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jan Wüsten<br>Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
