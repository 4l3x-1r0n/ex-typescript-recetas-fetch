export type ThemealdbCategory = {
    idCategory: string,
    strCategory: string;
}

export type ThemealdbRecipe = {
    [key: string]: unknown;
    idMeal: string;
    strInstructions: string;
    strMeal: string;
    strMealThumb: string;
}
