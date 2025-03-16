// Facebook Content Script
namespace FacebookSilencer {
  // Variable to track if silencing is enabled - default to OFF per requirements
  let silencingEnabled = false;
  
  // Function to load saved configuration
  function loadConfiguration() {
    chrome.storage.local.get('facebookSilencing', (result) => {
      // If there's a saved setting, use it; otherwise default to false (OFF)
      if (result.facebookSilencing !== undefined) {
        silencingEnabled = result.facebookSilencing;
      }
      // Apply current setting immediately
      silenceFeed();
      console.log(`Loaded configuration: silencing ${silencingEnabled ? 'enabled' : 'disabled'}`);
    });
  }
  
  // Function to save configuration
  function saveConfiguration() {
    chrome.storage.local.set({ 'facebookSilencing': silencingEnabled }, () => {
      console.log(`Saved configuration: silencing ${silencingEnabled ? 'enabled' : 'disabled'}`);
    });
  }
  
  // Load configuration on startup
  loadConfiguration();
  
  // Function to hide the Facebook feed
  function silenceFeed() {
    const feed = document.querySelector('[role="feed"]');
    if (feed) {
      (feed as HTMLElement).style.display = silencingEnabled ? "none" : "block";
    }
  }
  
  // Observer that watches for changes in the DOM
  const facebookObserver: MutationObserver = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => {
    if (silencingEnabled) {
      silenceFeed();
    }
  });
  
  // Start observing the document with the configured parameters
  facebookObserver.observe(document, {
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
      silenceFeed();
      
      // Send confirmation back to the popup
      sendResponse({ success: true, silencingEnabled });
    } else if (message.action === "getSilencingState") {
      // Respond with current state
      sendResponse({ silencingEnabled });
    }
    return true; // Keep the message channel open for the asynchronous response
  });
}
