


async function renderPageToHtml() {
    const iframes = document.querySelectorAll('iframe');
  
    for (const iframe of iframes) {
      const frameDoc = iframe.contentDocument;
  
      if (!frameDoc) continue;
  
      const el = frameDoc.querySelector('*');
  
      if (el) {
        iframe.innerHTML = el.outerHTML;
      }
    }
  
    const html = new XMLSerializer().serializeToString(document);
    return html;
  }
  
  // Usage
  renderPageToHtml().then((html) => {
    console.log(html);
  });
  