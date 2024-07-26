import React, { useState } from 'react';
import axios from 'axios';

const TodoGenerator: React.FC = () => {
    const [query, setQuery] = useState('');
    const [hackathonId, setHackathonId] = useState<number | null>(null);
    const [todoList, setTodoList] = useState('');

    const generateTodoList = async () => {
        try {
            const response = await axios.post('/api/query-todo', {
                query,
                hackathonId,
            });

            setTodoList(response.data.todoList);
        } catch (error) {
            console.error('Error generating TO-DO list:', error);
        }
    };

    return (
        <div>
            <h1>Generate TO-DO List</h1>
            <input 
                type="text" 
                placeholder="Enter query" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="Enter Hackathon ID" 
                value={hackathonId || ''} 
                onChange={(e) => setHackathonId(parseInt(e.target.value))} 
            />
            <button onClick={generateTodoList}>Generate</button>
            {todoList && (
                <div>
                    <h2>TO-DO List</h2>
                    <pre>{todoList}</pre>
                </div>
            )}
        </div>
    );
};

export default TodoGenerator;
