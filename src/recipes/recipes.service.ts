import { Injectable, NotFoundException } from '@nestjs/common';
import { NewRecipeInput } from './dto/new-recipe.input';
import { RecipesArgs } from './dto/recipes.args';
import { Recipe } from './models/recipe.model';

@Injectable()
export class RecipesService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  recipes: Recipe[] = [];

  async create(data: NewRecipeInput): Promise<Recipe> {
    const recipe: Recipe = {
      id: this.recipes.length.toString(),
      creationDate: new Date(),
      ...data,
    };

    this.recipes.push(recipe);

    return recipe;
  }

  async findOneById(id: string): Promise<Recipe> {
    const recipe = this.recipes.find(r => r.id === id);

    if (!recipe) throw new NotFoundException('Recipe Not Found');

    return recipe;
  }

  async findAll(recipesArgs: RecipesArgs): Promise<Recipe[]> {
    const { skip, take } = recipesArgs;

    return this.recipes.slice(skip, skip + take);
  }

  async remove(id: string): Promise<boolean> {
    const idx = this.recipes.findIndex(r => r.id === id);

    if (idx === -1) throw new NotFoundException('Recipe Not Found');

    delete this.recipes[idx];

    return true;
  }
}
