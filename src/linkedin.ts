const linkedinObserver: MutationObserver = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => {
    if(window.location.href.includes(".com/feed")){
      $("main").hide();
    } else {
      $("main").show();
    }
  });
  
  linkedinObserver.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
  