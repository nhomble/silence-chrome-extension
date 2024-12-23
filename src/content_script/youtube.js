const observer = new MutationObserver((mutations, obs) => {
  const comments = document.getElementById("comments");
  if (comments) {
    comments.remove();
  }

  const chat = document.getElementById("chat");
  if(chat){
    chat.remove();
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});
