(function() {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    let editMode = false;
    let editIndex = null;

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('recipe-form');
        const ingredientsList = document.getElementById('ingredients-list');
        const addIngredientBtn = document.getElementById('add-ingredient');
        const recipeList = document.getElementById('recipe-list');
        const clearFormBtn = document.getElementById('clear-form');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (editMode) {
                updateRecipe();
            } else {
                addRecipe();
            }
            saveRecipes();
            displayRecipes();
            clearInputFields();
        });

        addIngredientBtn.addEventListener('click', addIngredientField);

        ingredientsList.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-ingredient')) {
                e.target.closest('.ingredient-item').remove();
            }
        });

        recipeList.addEventListener('click', function(e) {
            if (e.target.closest('.edit-recipe')) {
                const index = e.target.closest('li').dataset.index;
                editRecipe(index);
            } else if (e.target.closest('.delete-recipe')) {
                const index = e.target.closest('li').dataset.index;
                deleteRecipe(index);
            }
        });

        clearFormBtn.addEventListener('click', function() {
            clearInputFields();
        });

        displayRecipes();
    });

    function addIngredientField() {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.innerHTML = `
            <input type="text" name="ingredient" placeholder="Ingredient" required>
            <button type="button" class="remove-ingredient">Remove</button>
        `;
        document.getElementById('ingredients-list').appendChild(ingredientItem);
    }

    function clearInputFields() {
        document.getElementById('recipe-form').reset();
        document.getElementById('ingredients-list').innerHTML = '';
        addIngredientField();
        document.querySelector('button[type="submit"]').textContent = 'Add Recipe';
        editMode = false;
        editIndex = null;
    }

    function getFormData() {
        const title = document.getElementById('title').value.trim();
        const instructions = document.getElementById('instructions').value.trim();
        const prepTime = document.getElementById('prep-time').value.trim();
        const cookTime = document.getElementById('cook-time').value.trim();
        const servings = document.getElementById('servings').value.trim();
        const imageUrl = document.getElementById('image-url').value.trim();
        const ingredients = Array.from(document.querySelectorAll('input[name="ingredient"]'))
            .map(input => input.value.trim())
            .filter(value => value);
        return { title, ingredients, instructions, prepTime, cookTime, servings, imageUrl };
    }

    function addRecipe() {
        const recipe = getFormData();
        if (recipe.title && recipe.ingredients.length && recipe.instructions) {
            recipes.push(recipe);
        }
    }

    function displayRecipes() {
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const li = document.createElement('li');
            li.className = 'recipe-card';
            li.dataset.index = index;
            li.innerHTML = `
                ${recipe.imageUrl ? `<img src="${recipe.imageUrl}" alt="${recipe.title}">` : ''}
                <h2>${recipe.title}</h2>
                <p><strong>Prep Time:</strong> ${recipe.prepTime} mins</p>
                <p><strong>Cook Time:</strong> ${recipe.cookTime} mins</p>
                <p><strong>Servings:</strong> ${recipe.servings}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <p><strong>Instructions:</strong></p>
                <p>${recipe.instructions}</p>
                <div class="icons">
                    <button type="button" class="edit-recipe"><svg data-lucide="edit-2"></svg></button>
                    <button type="button" class="delete-recipe"><svg data-lucide="trash-2"></svg></button>
                </div>
            `;
            recipeList.appendChild(li);
        });
        lucide.createIcons();
    }

    function editRecipe(index) {
        const recipe = recipes[index];
        document.getElementById('title').value = recipe.title;
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('prep-time').value = recipe.prepTime;
        document.getElementById('cook-time').value = recipe.cookTime;
        document.getElementById('servings').value = recipe.servings;
        document.getElementById('image-url').value = recipe.imageUrl;
        const ingredientsList = document.getElementById('ingredients-list');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('div');
            ingredientItem.className = 'ingredient-item';
            ingredientItem.innerHTML = `
                <input type="text" name="ingredient" value="${ingredient}" required>
                <button type="button" class="remove-ingredient">Remove</button>
            `;
            ingredientsList.appendChild(ingredientItem);
        });
        editMode = true;
        editIndex = index;
        document.querySelector('button[type="submit"]').textContent = 'Update Recipe';
    }

    function updateRecipe() {
        const recipe = getFormData();
        if (recipe.title && recipe.ingredients.length && recipe.instructions) {
            recipes[editIndex] = recipe;
        }
    }

    function deleteRecipe(index) {
        recipes.splice(index, 1);
        saveRecipes();
        displayRecipes();
    }

    function saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
})();