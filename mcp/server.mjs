import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const server = new McpServer({
  name: "curso-local-mcp",
  version: "0.1.0"
});

server.tool(
  "ping",
  "Comprueba que el servidor MCP local responde correctamente.",
  async () => ({
    content: [
      {
        type: "text",
        text: "pong"
      }
    ]
  })
);

server.tool(
  "sumar",
  "Suma dos numeros y devuelve el resultado.",
  {
    a: z.number(),
    b: z.number()
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: `${a + b}`
      }
    ],
    structuredContent: {
      result: a + b
    }
  })
);

server.tool(
  "leer_resumen_proyecto",
  "Lee package.json y devuelve un resumen rapido del proyecto actual.",
  async () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
    const scripts = Object.keys(packageJson.scripts ?? {});
    const dependencies = Object.keys(packageJson.dependencies ?? {});

    return {
      content: [
        {
          type: "text",
          text: [
            `Proyecto: ${packageJson.name ?? "sin-nombre"}`,
            `Version: ${packageJson.version ?? "sin-version"}`,
            `Scripts: ${scripts.join(", ") || "ninguno"}`,
            `Dependencias: ${dependencies.join(", ") || "ninguna"}`
          ].join("\n")
        }
      ],
      structuredContent: {
        name: packageJson.name ?? null,
        version: packageJson.version ?? null,
        scripts,
        dependencies
      }
    };
  }
);

server.tool(
  "github_list_repos",
  "Recupera los repositorios publicos de un usuario de GitHub.",
  {
    username: z.string().min(1)
  },
  async ({ username }) => {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);

    if (!response.ok) {
      return {
        content: [
          {
            type: "text",
            text: `No se pudieron recuperar los repositorios de ${username}. GitHub devolvio ${response.status}.`
          }
        ],
        isError: true
      };
    }

    const repos = await response.json();
    const simplified = repos.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      html_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at
    }));

    return {
      content: [
        {
          type: "text",
          text: simplified.length
            ? simplified.map((repo) => `${repo.full_name} | ${repo.html_url}`).join("\n")
            : `No se encontraron repositorios publicos para ${username}.`
        }
      ],
      structuredContent: {
        username,
        count: simplified.length,
        repos: simplified
      }
    };
  }
);

server.resource(
  "project-info",
  "curso://project/info",
  {
    description: "Informacion basica del proyecto local.",
    mimeType: "application/json"
  },
  async () => {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

    return {
      contents: [
        {
          uri: "curso://project/info",
          mimeType: "application/json",
          text: JSON.stringify(
            {
              name: packageJson.name ?? null,
              version: packageJson.version ?? null,
              scripts: packageJson.scripts ?? {}
            },
            null,
            2
          )
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();

await server.connect(transport);
