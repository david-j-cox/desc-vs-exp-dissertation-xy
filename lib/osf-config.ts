// This file contains the OSF configuration
// Values are loaded from environment variables

export const OSF_CONFIG = {
  // Only expose project ID and folder path on the client side
  // API token and sensitive data should only be used server-side
  projectId: process.env.NEXT_PUBLIC_OSF_PROJECT_ID || "",
}

// Server-side only configuration
export const getServerConfig = () => ({
  token: process.env.OSF_API_TOKEN,
  projectId: process.env.OSF_PROJECT_ID,
  nodeId: process.env.OSF_NODE_ID || "",
})
