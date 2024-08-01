import * as React from 'react';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [file, setFile] = useState<File | undefined>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    }

    useEffect(() => {
        // Add any side effect logic here
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            const url = 'http://localhost:5069/api/InputData';
            const formData = new FormData();
            formData.append('File', file);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            axios.post(url, formData, config)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("Error uploading file: ", error);
                });
        }
    }

    return (
        <div>
            <h1 id="tableLabel" > I will add upload capabilities here.</h1>
            {file &&
                (
                    <p>{file.name} </p>
                )
            }
            <form onSubmit={handleSubmit}>
                <h1>React File Upload </h1>
                <input type="file" onChange={handleChange} />
                <button type="submit" > Upload </button>
            </form>
        </div>
    )
}

export default App;