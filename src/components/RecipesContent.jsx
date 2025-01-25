export function RecipesContent() {
    const recipes = [
        {
            name: 'Latte',
            ingredients: ['Espresso', 'Buharlanmış Süt', 'Süt Köpüğü'],
            steps: [
                'Double shot espresso çekin',
                'Sütü 65°C ye kadar ısıtın',
                'Süt köpüğünü üzerine ekleyin'
            ]
        },
        // Daha fazla tarif eklenebilir
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">İçecek Tarifleri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe, index) => (
                    <div key={index} className="bg-[#27272a] p-4 rounded-lg">
                        <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                        <div className="mb-4">
                            <h4 className="text-gray-400">Malzemeler:</h4>
                            <ul className="list-disc list-inside">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-gray-400">Hazırlanış:</h4>
                            <ol className="list-decimal list-inside">
                                {recipe.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 