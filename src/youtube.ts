const youtubeObserver: MutationObserver = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => {
  const comments: HTMLElement | null = document.getElementById("comments");
  if (comments) {
    comments.remove();
  }

  const chat: HTMLElement | null = document.getElementById("chat");
  if(chat){
    chat.remove();
  }
});

youtubeObserver.observe(document, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});
