function loadScreen(screenName) {
    fetch(`./${screenName}/index.html`)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
      })
      .then(html => {
        // Inject HTML into screen container
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        document.getElementById('screen-container').innerHTML = doc.body.innerHTML;
  
        // Inject or update screen-specific CSS
        const existingLink = document.getElementById('screen-style');
        const cssPath = `./${screenName}/css/main.css`;
  
        if (existingLink) {
          existingLink.setAttribute('href', cssPath);
        } else {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.id = 'screen-style';
          link.href = cssPath;
          document.head.appendChild(link);
        }
      })
      .catch(err => {
        console.error('Screen load error:', err);
        document.getElementById('screen-container').innerHTML =
          `<p>Failed to load screen: ${screenName}</p>`;
      });
  }
  
  window.onload = () => loadScreen('gen-recipes');
