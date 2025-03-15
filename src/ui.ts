// Chrome extension API types
declare namespace chrome {
  namespace tabs {
    function query(queryInfo: {active: boolean, currentWindow: boolean}, 
                  callback: (tabs: {url?: string}[]) => void): void;
  }
}

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
    
    // Update website name
    if (websiteName) {
      websiteName.textContent = hostname;
    }
    
    // Define supported websites
    const supportedWebsites = ['youtube.com', 'linkedin.com', 'facebook.com'];
    
    // Find matching website
    const matchingWebsite = supportedWebsites.find(site => hostname.includes(site));
    
    if (matchingWebsite) {
      banner!.textContent = `Protection Active on ${matchingWebsite}`;
      banner!.className = 'active'; // Uses green color
      
      // Create a single toggle switch
      
      // Create label with switch class
      const label = document.createElement('label');
      label.className = 'switch';
      
      // Create checkbox input
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = 'protection-toggle';
      input.checked = true; // Default to enabled
      
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
      
      // Add event listener to the toggle
      input.addEventListener('change', () => {
        if (input.checked) {
          banner!.textContent = `Protection Enabled`;
          banner!.className = 'active';
        } else {
          banner!.textContent = `Protection Disabled`;
          banner!.className = 'inactive';
        }
      });
    } else {
      banner!.textContent = 'No Protection Available';
      banner!.className = 'inactive';
      featuresContainer!.innerHTML = '<p>This website is not supported by the extension.</p>';
    }
  });
}); 