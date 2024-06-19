"use client";
import React, { useState } from 'react';

export default function HomePage() {
    const[selectedOption, setSelectedOption] = useState("name");

    const handleChange = async(event) => {
        const option = event.target.value;
        setSelectedOption(option)

        const response = await fetch("/api/hello", {
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({option})          
        })

        if(response.ok){
                const data = await response.json();
                console.log(data);
        }
        else{
        console.error("error", response.statusText)
        }
    }
    return(
        <select name="sortOptions" value={selectedOption} onChange={handleChange}>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="releaseDate">Release Date</option>
        </select>
    )
}
    
