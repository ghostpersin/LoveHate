import React, { useState } from 'react';
import axios from 'axios';

const RapBattle = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async () => {
        const res = await axios.get('http://127.0.0.1:8000/api/bot/', {
            params: { mode: 'rap', prompt: prompt }
        });
        setResponse(res.data.response);
    };

    return (
        <div>
            <h2>Rap Battle</h2>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt"
            />
            <button onClick={handleSubmit}>Generate Rap</button>
            <p>{response}</p>
        </div>
    );
};

export default RapBattle;