const facebookObserver = new MutationObserver((mutations, obs) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.style.display = "none";
      }
    });
  });
});

facebookObserver.observe(document, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});
