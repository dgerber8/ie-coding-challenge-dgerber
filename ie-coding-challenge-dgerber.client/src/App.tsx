import * as React from 'react';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [file, setFile] = useState<File | undefined>();
    const [fileContent, setFileContent] = useState("");

    function readFileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Register callback function when file reading is complete
            reader.onload = function (event) {
                const arrayBuffer = event.target.result;
                resolve(arrayBuffer);
            };

            // Read file content to ArrayBuffer
            reader.readAsArrayBuffer(file);
        });
    }

    function arrayBufferToHexString(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        let hexString = "";
        for (let i = 0; i < uint8Array.length; i++) {
            const hex = '0' + uint8Array[i].toString(16);
            hexString += hex.substring(hex.length - 2) + ' ';
        }
        console.log(hexString.match(/.{48}/g))
        return hexString;
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0]
        if (file) {
            readFileToArrayBuffer(file)
                .then(arrayBuffer => {
                    const hexString = arrayBufferToHexString(arrayBuffer);
                    setFileContent(hexString);
                })
                .catch(error => {
                    console.error("File read failed:", error);
                });
        }




        if (event.target.files) {
            const file = event.target.files[0]
            setFile(event.target.files[0]);
        }
    }

    useEffect(() => {
        // Add any side effect logic here
    }, []);
   
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            const url = 'https://localhost:7208/api/InputData';
            const formData = new FormData();
            formData.append('File', file);
            formData.append('FileName', fileContent);
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

            <p> File Content Hex: </p>
            <p>{fileContent} </p>
        </div>
    )
}

export default App;