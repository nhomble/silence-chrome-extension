const observer = new MutationObserver((mutations, obs) => {
    const main = document.getElementById("main");
    if (main) {
        main.remove();
    }
  });
  
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
  