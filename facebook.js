const observer = new MutationObserver((mutations, obs) => {
  const nodeList = document.querySelectorAll('[role="main"]');
  for (let node of nodeList) {
    if (window.location.href.endsWith(".com/")) {
      node.style.display = "none";
    } else {
      node.style.display = "block";
    }
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});
