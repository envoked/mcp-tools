# Unifi
An [MCP](https://modelcontextprotocol.io/introduction) Server for interacting with data from a local [Unifi](https://ui.com) network.
Uses both [the official API](https://help.ui.com/hc/en-us/articles/30076656117655-Getting-Started-with-the-Official-UniFi-API) and unofficial API, inspired by [Unifi-Protect](https://github.com/hjdhjd/unifi-protect).

![Screencast](http://share.yoadrian.co/Screen-Capture-2025-05-13-12-08-30/Screen-Capture-2025-05-13-12-08-30.gif)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Configuration:

**Official API:**
PROTECT_API_KEY= {Get from control pane}

**Unofficial API (Recommend creating another user with limited permissions)**
UNIFI_USERNAME=
UNIFI_PASSWORD=

**Sometimes NODE will bark at the Unifi cert requiring this var to be set**
NODE_TLS_REJECT_UNAUTHORIZED=0
