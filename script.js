const searchBox = document.querySelector('.inputBox');
const button = document.querySelector('.btn');
const recipeContainer = document.querySelector('.recipeContainer');
const recipeDetailsContent = document.querySelector('.recipeDetailsContent');
const recipeCloseBtn = document.querySelector('.recipeCloseBtn');

const fetchRecipe = async (query) => {
    recipeContainer.innerHTML = `<div class="spinner"></div>`;
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        
        if (!response.meals) {
            recipeContainer.innerHTML = `<h1>No recipes found for "${query}"</h1>`;
            return;
        }

        recipeContainer.innerHTML = "";
        response.meals.forEach((meal) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipeDiv');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><strong>${meal.strArea}</strong> Dish</p>
                <p>Belongs to <strong>${meal.strCategory}</strong> Category</p>
            `;

            const viewButton = document.createElement('button');
            viewButton.textContent = "View Recipe";
            recipeDiv.appendChild(viewButton);

            // Adding event listener to recipe button
            viewButton.addEventListener('click', () => {
                openRecipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = `<h1>Error fetching recipes. Please try again later.</h1>`;
        console.error("Error fetching recipes:", error);
    }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientList;
};

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName"> Dish: ${meal.strMeal}</h2>
        <h3 class="ingHeading">Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div>
            <h3 class="insHeading">Instructions:</h3>
            <p class="recipeInstructions"><strong>SHUBHAM... </strong>${meal.strInstructions}</p>
        </div>
    `;

    const recipeDetails = recipeDetailsContent.parentElement;
    recipeDetails.style.display = "block";
    recipeDetails.classList.add('fade-in');
};

recipeCloseBtn.addEventListener('click', () => {
    const recipeDetails = recipeDetailsContent.parentElement;
    recipeDetails.classList.remove('fade-in');
    setTimeout(() => {
        recipeDetails.style.display = "none";
    }, 300);
});

button.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipe(searchInput);
    } else {
        alert("Please enter a search term.");
    }
});

// CSS for spinner and fade-in animation
const style = document.createElement('style');
style.textContent = `
.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #fff;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.fade-in {
    animation: fadeIn 0.3s;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`;
document.head.appendChild(style);
