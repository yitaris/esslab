export function DashboardContent({ dailyStats, shift, setShift }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Günlük Özet</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#27272a] p-4 rounded-lg">
                    <h3 className="text-gray-400">Toplam İçecek</h3>
                    <p className="text-2xl font-bold">{dailyStats.totalDrinks}</p>
                </div>
                <div className="bg-[#27272a] p-4 rounded-lg">
                    <h3 className="text-gray-400">Toplam Satış</h3>
                    <p className="text-2xl font-bold">{dailyStats.totalSales}₺</p>
                </div>
                <div className="bg-[#27272a] p-4 rounded-lg">
                    <h3 className="text-gray-400">Ortalama Hazırlama</h3>
                    <p className="text-2xl font-bold">{dailyStats.averagePreparationTime}dk</p>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-bold mb-4">Vardiya Notları</h3>
                <textarea
                    value={shift.notes}
                    onChange={(e) => setShift({...shift, notes: e.target.value})}
                    className="w-full bg-[#27272a] p-4 rounded-lg"
                    placeholder="Vardiya notlarınızı buraya yazın..."
                    rows={4}
                />
            </div>
        </div>
    );
} 