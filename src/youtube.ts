// YouTube Content Script
namespace YouTubeSilencer {
  // Variable to track if silencing is enabled - default to OFF per requirements
  let silencingEnabled = false;

  // Function to load saved configuration
  function loadConfiguration() {
    chrome.storage.local.get('youtubeSilencing', (result) => {
      // If there's a saved setting, use it; otherwise default to false (OFF)
      if (result.youtubeSilencing !== undefined) {
        silencingEnabled = result.youtubeSilencing;
      }
      // Apply current setting immediately
      silenceComments();
      console.log(`Loaded configuration: silencing ${silencingEnabled ? 'enabled' : 'disabled'}`);
    });
  }

  // Function to save configuration
  function saveConfiguration() {
    chrome.storage.local.set({ 'youtubeSilencing': silencingEnabled }, () => {
      console.log(`Saved configuration: silencing ${silencingEnabled ? 'enabled' : 'disabled'}`);
    });
  }

  // Load configuration on startup
  loadConfiguration();

  // Function to remove comments and chat
  function silenceComments() {
    const comments: HTMLElement | null = document.getElementById("comments");
    if (comments) {
      comments.style.display = silencingEnabled ? "none" : "block";
    }

    const chat: HTMLElement | null = document.getElementById("chat");
    if (chat) {
      chat.style.display = silencingEnabled ? "none" : "block";
    }
  }

  // Observer that watches for changes in the DOM
  const youtubeObserver: MutationObserver = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => {
    if (silencingEnabled) {
      silenceComments();
    }
  });

  // Start observing the document with the configured parameters
  youtubeObserver.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: (response?: any) => void) => {
    if (message.action === "toggleSilencing") {
      silencingEnabled = message.enabled;
      console.log(`Silencing ${silencingEnabled ? 'enabled' : 'disabled'}`);
      
      // Save the new configuration
      saveConfiguration();
      
      // Apply the current silencing state immediately
      silenceComments();
      
      // Send confirmation back to the popup
      sendResponse({ success: true, silencingEnabled });
    } else if (message.action === "getSilencingState") {
      // Respond with current state
      sendResponse({ silencingEnabled });
    }
    return true; // Keep the message channel open for the asynchronous response
  });
}
