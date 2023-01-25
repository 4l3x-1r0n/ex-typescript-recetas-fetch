import { categorias_select, favotiros_div, resultado_div } from "./class/UI/selectors.js";


import { TheMealDBApi } from "./class/TheMealDBApi/TheMealDBApi.js";
import { UI } from "./class/UI/UI.js";

import { LocalStorageDB, TLocalStorageDB } from "./class/LocalStorageDB/LocalStorage.js";
const localDb = new LocalStorageDB("recipes");

const ui = new UI();

//event liteners
document.addEventListener("DOMContentLoaded", appStart);


function appStart() {
    if (categorias_select) {
        categorias_select.addEventListener("change", () => showCategoria(categorias_select.value));

        TheMealDBApi.getCategories()
            .then((categories) => {
                ui.fillCategoriesSelect(categories);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if (favotiros_div) {
        const favoritos: TLocalStorageDB[] = localDb.getItems();
        if (!favoritos.length) {
            const noFavoritos = document.createElement("p");
            noFavoritos.textContent = "No hay favoritos";
            noFavoritos.classList.add("fs-4", "text-center", "font-bold", "mt-5");
            resultado_div.append(noFavoritos);
            return;
        }
        ui.showRecipes(favoritos);

    }
}

function showCategoria(category: string) {
    TheMealDBApi.getMealsByCategory(category)
        .then((meals) => {
            ui.showRecipes(meals);
        })
        .catch((err) => {
            console.log(err);
        });
}

