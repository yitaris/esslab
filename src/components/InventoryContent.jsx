export function InventoryContent({ inventory, setInventory }) {
    const updateInventory = (item, value) => {
        setInventory(prev => ({...prev, [item]: value}));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Stok Takibi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(inventory).map(([item, level]) => (
                    <div key={item} className="bg-[#27272a] p-4 rounded-lg">
                        <h3 className="text-gray-400 capitalize">{item}</h3>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={level}
                                onChange={(e) => updateInventory(item, parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className="text-lg font-bold">{level}%</span>
                        </div>
                        {level < 20 && (
                            <p className="text-red-500 text-sm mt-2">Stok kritik seviyede!</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 