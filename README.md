# MCP-Tools

A collection of [MCP](https://modelcontextprotocol.io/introduction) servers for enabling more present AI agents
- [Tempest Weather Station](tempest/README.md)
- [Unifi](unifi/README.md)
- [Pushify](pushify/README.md)
- [Fisheries](fisheries/README.md)

## Development Setup

### VS Code Launch Configuration

This repository contains a sample VS Code launch configuration file (`.vscode/launch.json.sample`) that should be used as a template for your local setup:

1. Copy the sample file to create your own launch.json:
   ```bash
   cp .vscode/launch.json.sample .vscode/launch.json
   ```

2. Edit `.vscode/launch.json` and replace the placeholder values with your actual credentials:
   - `UNIFI_SITE_ID`: Your Unifi site ID
   - `PROTECT_API_KEY`: Your Protect API key
   - `UNIFI_USERNAME` and `UNIFI_PASSWORD`: Your Unifi credentials
   - `FISHERIES_USERNAME` and `FISHERIES_PASSWORD`: Your Fisheries credentials

3. The launch configuration is set up to:
   - Use Bun for running and debugging TypeScript files
   - Load environment variables for each service
   - Ignore TLS certificate verification for development

**Note:** The `.vscode/launch.json` file is intentionally excluded from Git to prevent committing sensitive credentials. Never commit this file with your actual credentials.

### Environment Files

Each service directory has a `sample.env` file that can be used as a template for local configuration:

1. For each service you want to use, copy its sample.env file:
   ```bash
   cp unifi/sample.env unifi/.env
   cp fisheries/sample.env fisheries/.env
   cp pushify/sample.env pushify/.env
   ```

2. Edit each `.env` file to add your personal credentials

3. These environment files are used when running the services independently (not through VS Code's launch configuration)

**Note:** All `.env` files are excluded from Git to prevent committing sensitive information.

## Security Considerations

### Sensitive Information Management

This project requires various API keys and credentials to function. Follow these best practices:

1. **Never commit credentials**:
   - Always use `.env` files or environment variables
   - Use the provided sample files as templates
   - Double-check your commits to ensure no secrets are included

2. **Environment variables**:
   - Set environment variables at runtime or through configuration files
   - For VS Code debugging, use the launch.json configuration
   - For standalone services, use individual .env files

3. **Credential rotation**:
   - Periodically update your passwords and API keys
   - If you suspect any credentials have been compromised, rotate them immediately

4. **Development environment**:
   - The sample configuration includes `NODE_TLS_REJECT_UNAUTHORIZED=0` for development
   - This should never be used in production environments
