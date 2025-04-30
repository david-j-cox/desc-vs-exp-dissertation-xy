// This file contains the OSF configuration
// Values are loaded from environment variables

export const OSF_CONFIG = {
  // Only expose project ID and folder path on the client side
  // API token and sensitive data should only be used server-side
  projectId: "wszna",
}

// Server-side only configuration
export const getServerConfig = () => ({
  token: "cs1nbJ2IKlz8ODQw02340HXqdV5BvJgKF2tHubZfjG6AAOqJQ5x38LnKAvWiEuq6qXqimX",
  projectId: "wszna",
  nodeId: "",
})
