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

            // Populate the grocery list if the grocery-list screen is loaded
            if (screenName === 'grocery-list') {
                populateGroceryList();
            }

            // Populate the meal plan if the calendar screen is loaded
            if (screenName === 'calendar') {
                populateMealPlan('2025-04-28'); // Call after the DOM is updated
            }

            // Attach the popup functionality to the add-button if the full-recipe screen is loaded
            if (screenName === 'full-recipe' || screenName === 'full-recipe-salad' || screenName === 'full-recipe-sandwich') {
                const addButton = document.querySelector('.add-button');
                if (addButton) {
                    addButton.addEventListener('click', () => {
                        showAddedPopup();
                    });
                }

                const addFood = document.querySelector('.v2022_88');
                if (addFood) {
                    addFood.addEventListener('click', () => {
                        showAddedPopup();
                    });
                }
            }
        })
        .catch(err => {
            console.error('Screen load error:', err);
            document.getElementById('screen-container').innerHTML =
                `<p>Failed to load screen: ${screenName}</p>`;
        });
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
      alert('Please select a date between 2025-04-27 and 2025-04-29.');
      return;
  }

  // Add the meal to the selected date and meal type
  mealPlans[date][mealType].push(mealName);
  console.log(mealPlans);

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

    // Ensure the date exists in the mealPlans object
    if (!mealPlans[date]) {
        mealPlans[date] = { breakfast: [], lunch: [], dinner: [] };
    }

    // Iterate over meal types (breakfast, lunch, dinner)
    for (const mealType of ['breakfast', 'lunch', 'dinner']) {
        // Create a label for the meal type
        const mealTypeLabel = document.createElement('h3');
        mealTypeLabel.textContent = mealType.charAt(0).toUpperCase() + mealType.slice(1);
        mealPlanContainer.appendChild(mealTypeLabel);

        // Create a list for the meals
        const mealList = document.createElement('ul');
        const meals = mealPlans[date][mealType];

        if (meals.length === 0) {
            // Add a placeholder if no meals are present
            const placeholder = document.createElement('li');
            placeholder.textContent = 'No meals planned.';
            placeholder.style.fontStyle = 'italic';
            mealList.appendChild(placeholder);
        } else {
            meals.forEach(meal => {
                const mealItem = document.createElement('li');
                mealItem.textContent = meal;

                // Create a button next to the meal
                const loadButton = document.createElement('button');
                loadButton.textContent = 'View';
                loadButton.style.marginLeft = '10px'; // Add some spacing

                if (meal === 'Chicken Caesar Wrap') {
                    loadButton.onclick = () => {
                        loadScreen('full-recipe');
                        console.log(`Loading page for meal: ${meal}`);
                    };
                } else if (meal === 'Chicken Caesar Salad') {
                    loadButton.onclick = () => {
                        loadScreen('full-recipe-salad');
                        console.log(`Loading page for meal: ${meal}`);
                    };
                } else if (meal === 'Chicken Sandwich') {
                    loadButton.onclick = () => {
                        loadScreen('full-recipe-sandwich');
                        console.log(`Loading page for meal: ${meal}`);
                    };
                }

                // Append the button to the meal item
                mealItem.appendChild(loadButton);

                // Append the meal item to the list
                mealList.appendChild(mealItem);
            });
        }

        // Append the list to the container
        mealPlanContainer.appendChild(mealList);
    }
}

// Global grocery list
const groceryList = [];

// Function to add an item to the grocery list
function addToGroceryList(item) {
    if (!item) {
        console.error('No item provided to add to the grocery list.');
        return;
    }

    // Check if the item already exists in the list
    if (groceryList.includes(item)) {
        console.log(`${item} is already in the grocery list.`);
        return;
    }

    // Add the item to the list
    groceryList.push(item);
    console.log(`${item} added to the grocery list.`);
    console.log('Updated Grocery List:', groceryList);
}

function populateGroceryList() {
    const groceryListContainer = document.querySelector('.v2007_69');
    if (!groceryListContainer) {
        console.error('Grocery list container not found.');
        return;
    }

    // Clear any existing content
    groceryListContainer.innerHTML = '';

    // Add a title at the top of the grocery list
    const title = document.createElement('h2');
    title.textContent = 'Grocery List';
    title.style.textAlign = 'center'; // Center the title
    title.style.marginBottom = '24px'; // Add spacing below the title
    groceryListContainer.appendChild(title);


    // Iterate over the grocery list and create items
    groceryList.forEach(item => {
        // Create a parent container for the item
        const itemRow = document.createElement('div');
        itemRow.style.display = 'flex'; // Use flexbox to align elements side by side
        itemRow.style.alignItems = 'center'; // Vertically align the text and div
        itemRow.style.marginBottom = '10px'; // Add spacing between rows

        // Create a span for the item text
        const itemText = document.createElement('span');
        itemText.textContent = item;
        itemText.style.marginLeft = '40px'; // Add spacing between the bullet and the text
        itemText.style.fontSize = '20px'; // Set font size for the text


        itemRow.appendChild(itemText);

        // Append the parent container to the grocery list container
        groceryListContainer.appendChild(itemRow);
    });
}
    function showAddedPopup() {
        // Create the popup element
        const popup = document.createElement('div');
        popup.classList.add('added-popup');
        popup.textContent = 'Added';

        // Append the popup to the body
        document.body.appendChild(popup);

        // Show the popup
        popup.style.display = 'block';

        // Remove the popup after 1.5 seconds
        setTimeout(() => {
            popup.style.display = 'none';
            popup.remove();
        }, 1500);
    }

  window.onload = () => loadScreen('home-screen');
