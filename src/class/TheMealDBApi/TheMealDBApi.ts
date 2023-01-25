import { ThemealdbCategory, ThemealdbRecipe } from "./TTheMealDBApi.js";

export class TheMealDBApi {

    static getCategories(): Promise<ThemealdbCategory[]> {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.json())
                .then((result) => resolve(result.categories))
                .catch((error) => reject(error));
        });
    }

    static getMealsByCategory(category: string): Promise<ThemealdbRecipe[]> {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.json())
                .then((result) => resolve(result.meals))
                .catch((error) => reject(error));
        });
    }

    static getRecipeById(id: string): Promise<ThemealdbRecipe> {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => response.json())
                .then((result) => resolve(result.meals[0]))
                .catch((error) => reject(error));
        });
    }


}


