// Remove all custom Chrome type declarations
document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('banner');
  const featuresContainer = document.getElementById('features');
  const websiteName = document.getElementById('website-name');
  
  // Clear any existing content in features container
  if (featuresContainer) {
    featuresContainer.innerHTML = '';
  }
  
  // Get current tab information
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentUrl = tabs[0].url || '';
    const urlObj = new URL(currentUrl);
    const hostname = urlObj.hostname;
    const tabId = tabs[0].id;
    
    // Update website name
    if (websiteName) {
      websiteName.textContent = hostname;
    }
    
    // Define supported websites
    const supportedWebsites = ['youtube.com', 'linkedin.com', 'facebook.com'];
    
    // Find matching website
    const matchingWebsite = supportedWebsites.find(site => hostname.includes(site));
    
    if (matchingWebsite) {
      // Default state text (will be updated once we get actual state)
      let initialStateText = 'Loading Settings...';
      banner!.textContent = initialStateText;
      banner!.className = 'inactive'; // Start with inactive status until we know
      
      // Create a single toggle switch
      
      // Create label with switch class
      const label = document.createElement('label');
      label.className = 'switch';
      
      // Create checkbox input
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'protection-toggle';
      input.checked = false; // Default to NOT checked per requirements
      
      // Create slider span
      const slider = document.createElement('span');
      slider.className = 'slider';
      
      // Add elements to label
      label.appendChild(input);
      label.appendChild(slider);
      
      // Create wrapper div for the label and text
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.margin = '15px 0';
      
      // Add label to wrapper
      wrapper.appendChild(label);
      
      // Add text node to wrapper with stronger styling
      const textSpan = document.createElement('span');
      textSpan.textContent = 'Silence Commentary';
      textSpan.style.fontWeight = '500';
      
      wrapper.appendChild(textSpan);
      
      // Add wrapper to features container
      featuresContainer!.appendChild(wrapper);
      
      // Function to update UI based on silencing state
      const updateUI = (isEnabled: boolean) => {
        input.checked = isEnabled;
        if (isEnabled) {
          banner!.textContent = `Protection Enabled`;
          banner!.className = 'active';
        } else {
          banner!.textContent = `Protection Disabled`;
          banner!.className = 'inactive';
        }
      };
      
      // Try to get current state from content script
      if (tabId) {
        chrome.tabs.sendMessage(
          tabId,
          { action: "getSilencingState" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error getting state:", chrome.runtime.lastError);
              
              // Fallback to storage if content script is not ready
              const storageKey = `${matchingWebsite.replace('.', '_')}Silencing`;
              chrome.storage.local.get(storageKey, (result) => {
                const storedState = result[storageKey];
                updateUI(!!storedState); // Convert to boolean
              });
              return;
            }
            
            if (response && response.silencingEnabled !== undefined) {
              updateUI(response.silencingEnabled);
            }
          }
        );
      }
      
      // Add event listener to the toggle
      input.addEventListener('change', () => {
        if (tabId) {
          // Send message to the content script
          chrome.tabs.sendMessage(
            tabId,
            { action: "toggleSilencing", enabled: input.checked },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError);
                return;
              }
              
              if (response && response.success) {
                updateUI(input.checked);
                console.log(`Silencing ${input.checked ? 'enabled' : 'disabled'}`);
              }
            }
          );
        }
      });
    } else {
      banner!.textContent = 'No Protection Available';
      banner!.className = 'inactive';
      featuresContainer!.innerHTML = '<p>This website is not supported by the extension.</p>';
    }
  });
}); 