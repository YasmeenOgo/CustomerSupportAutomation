import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

const MCP_CONFIG_FILE = path.join(process.cwd(), ".mcp-config.json");

function loadMCPConfig(): any {
  try {
    if (!fs.existsSync(MCP_CONFIG_FILE)) {
      return { mcpServers: {} };
    }
    const content = fs.readFileSync(MCP_CONFIG_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("[MCP] Error loading config:", error.message);
    return { mcpServers: {} };
  }
}

export async function executeMCPCommand(serverName: string, toolName: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const mcpConfig = loadMCPConfig();
    const serverConfig = mcpConfig.mcpServers[serverName];
    
    if (!serverConfig) {
      return reject(new Error(`MCP server "${serverName}" not found in config`));
    }
    
    const command = `${serverConfig.command} ${serverConfig.args.join(' ')} ${toolName} --params '${JSON.stringify(params)}'`;
    
    // console.log(`[DEBUG] Executing MCP command: ${command}`);
    
    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${stderr || error.message}`);
        return reject(new Error(stderr || error.message));
      }
      
      if (stderr) {
        console.warn(`stderr: ${stderr}`);
      }
      
      // console.log(`[DEBUG] MCP response raw: ${stdout.substring(0, 200)}...`);
      
      try {
        const jsonStartMarker = "---JSON_START---";
        const jsonEndMarker = "---JSON_END---";
        const startIndex = stdout.indexOf(jsonStartMarker);
        const endIndex = stdout.indexOf(jsonEndMarker);
        
        if (startIndex >= 0 && endIndex > startIndex) {
          const jsonString = stdout.substring(startIndex + jsonStartMarker.length, endIndex).trim();
          // console.log(`[DEBUG] Extracted JSON string: ${jsonString.substring(0, 200)}...`);
          
          const result = JSON.parse(jsonString);
          // console.log(`[DEBUG] MCP parsed response: ${JSON.stringify(result).substring(0, 200)}...`);
          resolve(result);
        } else {
          const jsonStartIndex = stdout.indexOf('{');
          const jsonEndIndex = stdout.lastIndexOf('}');
          
          if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
            const jsonString = stdout.substring(jsonStartIndex, jsonEndIndex + 1);
            // console.log(`[DEBUG] Fallback extraction - JSON string: ${jsonString.substring(0, 200)}...`);
            
            const result = JSON.parse(jsonString);
            // console.log(`[DEBUG] Fallback parsed response: ${JSON.stringify(result).substring(0, 200)}...`);
            resolve(result);
          } else {
            // console.log(`[DEBUG] Could not find valid JSON in response`);
            resolve({ success: false, message: "Invalid response format from MCP server" });
          }
        }
      } catch (e) {
        // console.log(`[DEBUG] Failed to parse MCP response as JSON:`, e);
        resolve({ success: false, message: "Failed to parse response from MCP server" });
      }
    });
  });
}
