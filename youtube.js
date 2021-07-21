const observer = new MutationObserver((mutations, obs) => {
  const comments = document.getElementById("comments");
  if (comments) {
    comments.remove();
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});
