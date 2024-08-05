import * as React from 'react';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import './App.css';
import { readFile } from 'fs/promises';
const ENGINE_ID = ["07", "e0"]
const DONGLE_ID = ["07", "e8"]
function App() {
    const [file, setFile] = useState<File | undefined>();
    const [fileContent, setFileContent] = useState("");
    const [arrBuffer, setArrBuffer] = useState<ArrayBuffer>();
    const [roperations, setRoprations] = useState([]);

    function readFileToArrayBuffer(file) : Promise<ArrayBuffer | string>{
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
        console.log(hexString.match(/.{51}/g))
        return hexString;
    }
    function grabNextLine() {
        let hexString = ''
        let row = new Uint8Array(arrBuffer.slice(0, 17))
        

        for (let i = 0; i < row.length; i++) {
            const hex = '0' + row[i].toString(16);
            hexString += hex.substring(hex.length - 2) + ' ';
        }

        return hexString.slice(0, -1).split(' ')
    }
    function getEngineId(row) {
        return [row[6], row[7]]
    }
    function getOperationType(row) {
        return row[8].charAt(0)
    }

    function getServiceNumber(row) {
        if (getOperationType(row) == '0') {
            return row[10]
        } if (getOperationType(row) == '1') {
            return row[11]
        }
        if (getOperationType(row) == '2') {
            return undefined
        }
    }
    async function processData(test_num_max){
        let startFound = false;
        let row;
        let test_i = 0
        let hexString = "";
        while (!startFound && test_i < test_num_max) {
            row = grabNextLine()
            

            setArrBuffer(arrBuffer.slice(17))
            if (getEngineId(row) == ENGINE_ID && getServiceNumber(row) == '36') {
                console.log(`found on row: ${test_i}`)
                hexString = JSON.stringify(row)
                startFound = true
            }

            test_i += 1
        }
        return hexString
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0]
        if (file) {
            readFileToArrayBuffer(file)
                .then(arrayBuffer => {
                    if ( arrayBuffer instanceof ArrayBuffer) {
                        setArrBuffer(arrayBuffer)
                    }
                    const hexString = arrayBufferToHexString(arrayBuffer);
                    //setFileContent(hexString);
                })
                .catch(error => {
                    console.error("File read failed:", error);
                });
        }
        if (event.target.files) {
            setFile(event.target.files[0]);

        }
    }

    const handleButton = () => {
        let pData = async () => {
            const hexString = await processData(1000);
            setFileContent(hexString)
        }
        if (arrBuffer) {
            pData()
        }
    }

    useEffect(() => {
        let pData = async () => {
            const hexString = JSON.stringify(grabNextLine());
            setFileContent(hexString)
        }
        if (arrBuffer) {
            pData()
        }
        // Add any side effect logic here
    }, [file]);
   
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
                <button onClick={ handleButton } > Next Line </button>
            </form>

            <p> File Content Hex: </p>
            <p>{fileContent} </p>
        </div>
    )
}

export default App;