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

      if (screenName === 'calendar') {
        populateMealPlan("2025-04-27");
      }
  }
  
// Global object to store meal plans
const mealPlans = {
  "2025-04-27": { breakfast: [], lunch: [], dinner: [] },
  "2025-04-28": { breakfast: [], lunch: [], dinner: [] },
  "2025-04-29": { breakfast: [], lunch: [], dinner: [] }
};

function addMeal(date, mealType, mealName) {

  if (!date || !mealType) {
      alert('Please select both a date and a meal type.');
      return;
  }

  if (!mealPlans[date]) {
      alert('Date outside of implemented range. Please select a date between 2025-04-27 and 2025-04-29.');
      return;
  }

  // Add the meal to the selected date and meal type
  mealPlans[date][mealType].push(mealName);
  console.log(mealPlans);

  alert(`Added to plan: ${mealName} for ${mealType} on ${date}`);
  populateMealPlan(date); // Refresh the meal plan display

}

function populateMealPlan(date) {
    console.log(`Populating meal plan for date: ${date}`);

    const mealPlanContainer = document.getElementById(`meal-plan`);
    if (!mealPlanContainer) {
        console.error(`Container not found.`);
        return;
    }

    // Clear any existing content
    mealPlanContainer.innerHTML = '';

    // Add a heading for the date
    const heading = document.createElement('h2');
    heading.textContent = `Meals for ${date}`;
    mealPlanContainer.appendChild(heading);

    // Check if the date exists in mealPlans
    if (!mealPlans[date]) {
        mealPlanContainer.innerHTML += '<p>No meals planned for this date.</p>';
        return;
    }

    // Iterate over meal types (breakfast, lunch, dinner)
    for (const [mealType, meals] of Object.entries(mealPlans[date])) {
        // Create a label for the meal type
        const mealTypeLabel = document.createElement('h3');
        mealTypeLabel.textContent = mealType.charAt(0).toUpperCase() + mealType.slice(1);
        mealPlanContainer.appendChild(mealTypeLabel);

        // Create a list for the meals
        const mealList = document.createElement('ul');
        meals.forEach(meal => {
            const mealItem = document.createElement('li');
            mealItem.textContent = meal;

            // Create a button next to the meal
            const loadButton = document.createElement('button');
            loadButton.textContent = 'View';
            loadButton.style.marginLeft = '10px'; // Add some spacing
            
            if (meal === 'Chicken Caesar Wrap') {
              loadButton.onclick = () => {
                  loadScreen('full-recipe'); // Replace 'full-recipe' with the desired screen name
                  console.log(`Loading page for meal: ${meal}`);
              };
            }
            // Append the button to the meal item
            mealItem.appendChild(loadButton);

            // Append the meal item to the list
            mealList.appendChild(mealItem);
        });

        // Append the list to the container
        mealPlanContainer.appendChild(mealList);
    }
}

  window.onload = () => loadScreen('home-screen');
