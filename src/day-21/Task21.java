package tasks;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

public class Task21 {
    private static class Food {
        private final Set<String> ingredients;
        private final Set<String> allergens;

        public Food(String line) {
            var splitPosition = line.indexOf('(');
            ingredients = Set.of(line.substring(0, splitPosition).split(" "));

            var allergensIndex = splitPosition + 1 + "contains ".length();
            allergens = Set.of(line.substring(allergensIndex, line.length() - 1).split(", "));
        }

        @Override
        public String toString() {
            return "Food{" +
                    "ingredients=" + ingredients +
                    ", allergens=" + allergens +
                    '}';
        }
    }

    public static void main(String[] args) {
        var lines = readInput();
        var foods = lines
                .stream()
                .map(Food::new)
                .collect(Collectors.toUnmodifiableList());

        var allergensToIngredients = new HashMap<String, Set<String>>();
        for (Food food : foods) {
            for (String allergen : food.allergens) {
                allergensToIngredients.compute(allergen, (__, ingredients) -> {
                    if (ingredients == null) return new HashSet<>(food.ingredients);
                    ingredients.retainAll(food.ingredients);
                    return ingredients;
                });
            }
        }

        System.out.println(count(allergensToIngredients, foods));

        var ingredientToAllergen = new HashMap<String, String>();
        while (ingredientToAllergen.size() < allergensToIngredients.size()) {
            var processed = new HashSet<String>();
            allergensToIngredients.forEach((allergen, ingredients) -> {
                if (ingredients.size() == 1) {
                    var next = ingredients.iterator().next();
                    processed.add(next);
                    ingredientToAllergen.put(next, allergen);
                }
            });

            allergensToIngredients.forEach((s, strings) -> strings.removeAll(processed));
        }

        var ingredients = ingredientToAllergen.keySet().toArray(String[]::new);
        Arrays.sort(ingredients, Comparator.comparing(ingredientToAllergen::get));

        System.out.println(String.join(",", ingredients));
    }

    private static long count(Map<String, Set<String>> allergensToIngredients, List<Food> foods) {
        var withAllergens = allergensToIngredients
                .values()
                .stream()
                .flatMap(Collection::stream)
                .collect(Collectors.toSet());

        return foods
                .stream()
                .flatMap(el -> el.ingredients.stream())
                .filter(el -> !withAllergens.contains(el))
                .count();
    }

    private static List<String> readInput() {
        var resource = Task21.class.getClassLoader().getResource("input21.txt");
        try {
            assert resource != null;
            return Files.readAllLines(Paths.get(resource.toURI()));
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

}
