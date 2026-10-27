import test from 'node:test';
import assert from 'node:assert/strict';
import { recipes, calories } from '../src/recipes.js';

test('recipe identifiers are unique and every recipe has complete nutritional and preparation data', () => {
  assert.equal(new Set(recipes.map(recipe => recipe.id)).size, recipes.length);
  for (const recipe of recipes) {
    assert.ok(recipe.name && recipe.cuisine && recipe.subcategory, recipe.id);
    assert.ok(['أطباق', 'حلويات', 'مشروبات'].includes(recipe.kind), recipe.id);
    assert.ok(['صحي', 'غير صحي'].includes(recipe.health) && recipe.healthReason, recipe.id);
    assert.ok(Number.isInteger(recipe.servings) && recipe.servings > 0, recipe.id);
    assert.ok(recipe.ingredients.length > 0 && recipe.steps.length >= 3, recipe.id);
    for (const ingredient of recipe.ingredients) {
      assert.ok(ingredient.name && ingredient.unit, recipe.id);
      assert.ok(Number.isFinite(ingredient.quantity) && ingredient.quantity > 0, recipe.id);
      assert.ok(Number.isFinite(ingredient.calories) && ingredient.calories >= 0, recipe.id);
    }
    assert.equal(calories(recipe), Math.round(recipe.ingredients.reduce((sum, item) => sum + item.calories, 0) / recipe.servings));
  }
});

test('every collection includes both nutrition classifications', () => {
  for (const kind of ['أطباق', 'حلويات', 'مشروبات']) {
    for (const health of ['صحي', 'غير صحي']) {
      assert.ok(recipes.some(recipe => recipe.kind === kind && recipe.health === health), `${kind}: ${health}`);
    }
  }
});
