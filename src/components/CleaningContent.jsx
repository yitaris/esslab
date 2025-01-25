export function CleaningContent({ tasks, setTasks }) {
    const toggleTask = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId 
                ? {...task, completed: !task.completed}
                : task
        ));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Temizlik Kontrol Listesi</h2>
            
            <div className="space-y-2">
                {tasks.map(task => (
                    <div 
                        key={task.id}
                        className="flex items-center gap-3 bg-[#27272a] p-4 rounded-lg"
                    >
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="w-5 h-5"
                        />
                        <span className={task.completed ? 'line-through text-gray-400' : ''}>
                            {task.task}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
} 