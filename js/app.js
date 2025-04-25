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
  
  function addMeal(date, mealType) {
    if (!date || !mealType) {
        alert('Please select both a date and a meal type.');
        return;
    }

    // Retrieve existing meal plans from localStorage
    const mealPlans = JSON.parse(localStorage.getItem('mealPlans')) || [];

    // Add the new meal plan to the list
    mealPlans.push({ date, mealType });

    // Save the updated list back to localStorage
    localStorage.setItem('mealPlans', JSON.stringify(mealPlans));

    alert(`Added to plan: ${mealType} on ${date}`);
  }

  window.onload = () => loadScreen('home-screen');
  window.onload = () => loadScreen('home-screen'); //CHANGING THIS FOR NOW //
