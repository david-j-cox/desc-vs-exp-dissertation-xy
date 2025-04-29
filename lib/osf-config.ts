// This file contains the OSF configuration
// Values are loaded from environment variables

export const OSF_CONFIG = {
  // Your OSF personal access token
  token: process.env.OSF_API_TOKEN || "",

  // Your OSF project ID (the 5-character ID from your project URL)
  projectId: process.env.OSF_PROJECT_ID || "",

  // Optional: Storage node ID if you want to store files in a specific component
  // Leave as empty string to use the project root
  nodeId: "",

  // Optional: Folder path within the project/node where files should be stored
  // Example: "data/experiment-results/"
  // Leave as empty string to store in the root directory
  folderPath: "online_data_repo/",
}
