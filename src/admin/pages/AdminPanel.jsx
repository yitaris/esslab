import React, { useState, useEffect, useCallback } from 'react';
import { UserAuth } from '../../context/SupabaseContext';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

export default function AdminPanel() {
    const { user, fetchBranchUsers, updateUserTasks } = UserAuth();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    // Add predefined tasks
    const predefinedTasks = [
        { id: 1, name: 'Günlük Rapor' },
        { id: 2, name: 'Toplantı' },
        { id: 3, name: 'Müşteri Görüşmesi' },
        { id: 4, name: 'Proje Takibi' }
    ];

    useEffect(() => {
        const loadUsers = async () => {
            const storedUsers = JSON.parse(localStorage.getItem('branchUsers'));
            if (storedUsers && storedUsers.length > 0) {
                processUsers(storedUsers);
            } else if (user?.branch_id) {
                const branchUsers = await fetchBranchUsers(user.branch_id);
                localStorage.setItem('branchUsers', JSON.stringify(branchUsers));
                processUsers(branchUsers);
            }
        };

        const processUsers = (branchUsers) => {
            const manager = branchUsers.find(user => user.title === 'Müdür');
            const otherUsers = branchUsers.filter(user => user.title !== 'Müdür');
            
            // Her kullanıcı için tasks alanını kontrol et
            const processedUsers = branchUsers.map(user => ({
                ...user,
                tasks: user.tasks || [] // tasks yoksa boş array ata
            }));
            
            const sortedUsers = manager ? 
                [processedUsers.find(u => u.title === 'Müdür'), 
                 ...processedUsers.filter(u => u.title !== 'Müdür')] 
                : processedUsers;
            
            setUsers(sortedUsers);

            const generatedNodes = sortedUsers.map((user, index) => {
                const row = Math.floor((index - 1) / 3);
                const col = (index - 1) % 3;
                return {
                    id: user.id,
                    data: { 
                        label: (
                            <div className="flex flex-col items-center p-2">
                                <img 
                                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full mb-2"
                                />
                                <div className="text-center">
                                    <div>{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.title}</div>
                                </div>
                                {user.tasks && user.tasks.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {user.tasks.map(task => (
                                            <div key={task.id} className="bg-gray-100 p-1 rounded mt-1">
                                                {task.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    },
                    position: { x: col * 300, y: row * 250 }, // Increased spacing
                    style: { 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        padding: '10px',
                        minWidth: '200px'
                    },
                };
            });

            const generatedEdges = manager ? otherUsers.map(user => ({
                id: `e-${manager.id}-${user.id}`,
                source: manager.id,
                target: user.id,
                animated: true,
                style: { stroke: '#2563eb', strokeWidth: 2 },
            })) : [];

            setNodes(generatedNodes);
            setEdges(generatedEdges);
        };

        loadUsers();
    }, [user, fetchBranchUsers]);

    // Node'a tıklandığında kullanıcıyı seçme
    const onNodeClick = useCallback((event, node) => {
        const userData = users.find(u => u.id === node.id);
        setSelectedUser(userData);
    }, [users]);

    // Add new function to remove task
    const removeUserTask = async (taskId) => {
        if (!selectedUser) return;

        const updatedTasks = selectedUser.tasks.filter(task => task.id !== taskId);
        
        // Update Supabase
        const success = await updateUserTasks(selectedUser.id, updatedTasks);
        
        if (success) {
            // Update local state
            const updatedUsers = users.map(u => {
                if (u.id === selectedUser.id) {
                    return {
                        ...u,
                        tasks: updatedTasks
                    };
                }
                return u;
            });
            setUsers(updatedUsers);
            
            // Update nodes
            updateNodeWithTasks(selectedUser.id, updatedTasks);
        }
    };

    // Modify addNewUserTask to include Supabase update
    const addNewUserTask = async (taskId) => {
        if (!selectedUser) return;

        const selectedTask = predefinedTasks.find(task => task.id === taskId);
        if (!selectedTask) return;

        const updatedTasks = [...(selectedUser.tasks || []), selectedTask];
        
        // Update Supabase
        const success = await updateUserTasks(selectedUser.id, updatedTasks);
        
        if (success) {
            // Update local state
            const updatedUsers = users.map(u => {
                if (u.id === selectedUser.id) {
                    return {
                        ...u,
                        tasks: updatedTasks
                    };
                }
                return u;
            });
            setUsers(updatedUsers);
            
            // Update nodes
            updateNodeWithTasks(selectedUser.id, updatedTasks);
        }
    };

    // Helper function to update node visualization
    const updateNodeWithTasks = (userId, tasks) => {
        setNodes(nodes.map(node => {
            if (node.id === userId) {
                const updatedUser = users.find(u => u.id === userId);
                return {
                    ...node,
                    data: {
                        label: (
                            <div className="flex flex-col items-center p-2">
                                <img 
                                    src={updatedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedUser.name)}`} 
                                    alt={updatedUser.name}
                                    className="w-12 h-12 rounded-full mb-2"
                                />
                                <div className="text-center">
                                    <div>{updatedUser.name}</div>
                                    <div className="text-sm text-gray-500">{updatedUser.title}</div>
                                </div>
                                {tasks && tasks.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {tasks.map(task => (
                                            <div key={task.id} className="bg-gray-100 p-1 rounded mt-1 flex justify-between items-center">
                                                <span>{task.name}</span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeUserTask(task.id);
                                                    }}
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    }
                };
            }
            return node;
        }));
    };

    return (
        <div className="w-full h-full flex">
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView
                    style={{ width: '100%', height: '100%' }}
                >
                    <Controls />
                    <Background color="#ddd" gap={16} />
                </ReactFlow>
            </div>
            {/* Sağ Panel - Kullanıcı Seçimi */}
            {selectedUser && (
                <div className="w-64 p-4 bg-gray-200 dark:bg-gray-800 shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedUser.title}</p>
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Görev Ekle:</h4>
                        {predefinedTasks.map(task => (
                            <button 
                                key={task.id}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg mb-2 hover:bg-blue-600"
                                onClick={() => addNewUserTask(task.id)}
                            >
                                {task.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
