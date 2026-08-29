/** Public Notra inbox endpoint for agent feedback. Not a secret: it only accepts feedback submissions. */
export const FEEDBACK_URL = "https://api.usenotra.com/v1/feedback/notra";

export const FEEDBACK_PRODUCT_NAME = "Notra";

/** Identifies this MCP server as the client on submitted feedback. */
export const FEEDBACK_AGENT_CLIENT = "notra-mcp";
