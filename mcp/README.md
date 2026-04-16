# Servidor MCP local

Este proyecto incluye un servidor MCP local por `stdio`.

## Arranque manual

```bash
npm run mcp:start
```

## Uso desde un cliente MCP

Usa como referencia `mcp/mcp.config.example.json`.

Configuracion base:

```json
{
  "mcpServers": {
    "curso-local": {
      "command": "node",
      "args": ["C:\\Curso\\mcp\\server.mjs"]
    }
  }
}
```

## Herramientas incluidas

- `ping`
- `sumar`
- `leer_resumen_proyecto`

## Recurso incluido

- `curso://project/info`
