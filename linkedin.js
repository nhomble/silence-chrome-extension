const observer = new MutationObserver((mutations, obs) => {
    if(window.location.href.includes(".com/feed")){
      $("main").hide();
    } else {
      $("main").show();
    }
  });
  
  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
  