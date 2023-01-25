import { categorias_select, resultado_div, modal } from "./selectors.js";
import { ThemealdbCategory, ThemealdbRecipe } from "../TheMealDBApi/TTheMealDBApi.js";//TODO LIMPIAR ESTO HE INCLUIR ESTO EN FUNCIONES
import { TheMealDBApi } from "../TheMealDBApi/TheMealDBApi.js";
import { saveToLocalStorage, removeFromLocalStorage, itemExistInLocalStorage, showToast } from "../../functions.js";

export class UI {

    fillCategoriesSelect(categories: ThemealdbCategory[]) {
        categories.forEach(({ strCategory }) => {
            const option = document.createElement("option");
            option.value = strCategory;
            option.textContent = strCategory;
            categorias_select.append(option);
        });
    }

    private resetHtml(element: HTMLElement) {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    }

    showRecipes(recipes: ThemealdbRecipe[]) {
        this.resetHtml(resultado_div);

        const heading = document.createElement("h2");
        heading.classList.add("text-center", "text-black", "my-5");
        heading.textContent = recipes.length ? "Resultados" : "No hay resultados";
        resultado_div.append(heading);

        recipes.forEach(({ idMeal, strMeal, strMealThumb }) => {

            const recipeContainer = document.createElement("div");
            recipeContainer.classList.add("col-md-4");

            const recipeCard = document.createElement("div");
            recipeCard.classList.add("card", "mb-4");

            const recipeImg = document.createElement("img");
            recipeImg.classList.add("card-img-top");
            recipeImg.alt = `Imagen de la receta ${strMeal}`;
            recipeImg.src = strMealThumb;

            const recipeCardBody = document.createElement("div");
            recipeCardBody.classList.add("card-body");

            const recipeHeading = document.createElement("h3");
            recipeHeading.classList.add("card-title", "mb-3");
            recipeHeading.textContent = strMeal;

            const recipeButton = document.createElement("button");
            recipeButton.classList.add("btn", "btn-danger", "w-100");
            recipeButton.textContent = "Ver Receta";
            recipeButton.dataset.bsTarget = "#modal";
            recipeButton.dataset.bsToogle = "modal";

            recipeButton.onclick = () => {
                TheMealDBApi.getRecipeById(idMeal)
                    .then((recipe) => this.showRecipeModal(recipe));
            };

            // inyectar en el html
            recipeCardBody.append(recipeHeading);
            recipeCardBody.append(recipeButton);

            recipeCard.append(recipeImg);
            recipeCard.append(recipeCardBody);

            recipeContainer.append(recipeCard);

            resultado_div.append(recipeContainer);
        });
    }

    showRecipeModal(recipe: ThemealdbRecipe) {
        const { idMeal, strInstructions, strMeal, strMealThumb } = recipe;
        const modalTitle = document.querySelector(".modal .modal-title") as HTMLDivElement;
        const modalBody = document.querySelector(".modal .modal-body") as HTMLDivElement;

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
        <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}">
        <h3 class="my-3">Instrucciones</h3>
        <p>${strInstructions}</p>
        <h3 class="my-3">Ingredientes y Cantidades</h3>
    `;

        const listGroup = document.createElement("ul");
        listGroup.classList.add("list-group");
        //mostrar ingredientes
        for (let i = 1; i <= 20; i++) {
            if (!recipe[`strIngredient${i}`]) {
                break;
            }
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            const ingredientsLi = document.createElement("li");
            ingredientsLi.classList.add("list-group-item");
            ingredientsLi.textContent = `${ingredient} - ${measure}`;

            listGroup.append(ingredientsLi);
        }

        modalBody.append(listGroup);

        const modalFooter = document.querySelector(".modal-footer") as HTMLDivElement;
        //botones guardar y cerrar
        const btnFavorito = document.createElement("button");
        btnFavorito.classList.add("btn", "btn-danger", "col");


        btnFavorito.textContent = itemExistInLocalStorage(idMeal) !== -1 ? "Eliminar Favorito" : "Guardar Favorito";
        btnFavorito.onclick = () => {
            if (itemExistInLocalStorage(idMeal) === -1) {
                saveToLocalStorage({ idMeal, strMeal, strMealThumb });
                showToast("Se agregó a Favoritos");
                btnFavorito.textContent = "Eliminar Favorito";
                return;
            }
            removeFromLocalStorage(idMeal);
            showToast("Se eliminó de Favoritos");
            btnFavorito.textContent = "Guardar Favorito";
        };

        const btnCerrarModal = document.createElement("button");
        btnCerrarModal.classList.add("btn", "btn-secondary", "col");
        btnCerrarModal.textContent = "Cerrar";
        btnCerrarModal.onclick = () => modal.hide();

        this.resetHtml(modalFooter);
        modalFooter.append(btnFavorito);
        modalFooter.append(btnCerrarModal);

        modal.show();
    }

    static showToast(msg: string) {
        const toast_div = document.querySelector("#toast") as HTMLDivElement;
        const toast_body = document.querySelector(".toast-body") as HTMLDivElement;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const toast = new bootstrap.Toast(toast_div);
        toast_body.textContent = msg;

        toast.show();
    }
}
