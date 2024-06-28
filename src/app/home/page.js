"use client";
import React, { useState } from 'react';
import { useEffect } from 'react';

export default function HomePage() {
    const [selectedOption, setSelectedOption] = useState("game_name");
    const [data, setData] = useState("");
    let [games, setGames] = useState([]);

    const loadIGDB = async () => {
        try {
            const response = await fetch('/api/getIGDB'); // Note the leading slash
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json(); // Parse JSON response
            return data; // Return the fetched data
        } catch (error) {
            console.error('Error fetching IGDB data:', error);
            throw error; // Rethrow the error to be handled where loadIGDB is called
        }
    }

    const loadData = async () => {
        try {
            const response = await fetch('/api/hello');
            if (response.ok) {
                const body = await response.json();
                setData(body.text);
            }
            else {
                console.error("Error fetching data");
            }
        }
        catch {
            console.error("Unable to fetch api data");
        }
    }

    const loadGames = async () => {
        try {
            const response = await fetch("/api/getGames", {
                method: 'POST',
                body: selectedOption
            });
            if (response.ok) {
                const body = await response.json();
                const newGames = body.map((item) => (
                    {
                        key: item.game_id,
                        id: item.game_id,
                        game_name: item.game_name,
                        rating: item.rating,
                        release_date: item.release_date,
                        summary: item.summary,
                        review: item.review
                    }
                ));

                setGames(newGames);
            }
            else {
                console.error("error fetching game record");
            }
        }
        catch {
            console.error("error")
        }
    }

    const optionsChange = async (event) => {
        const option = event.target.value;

    }

    const reviewBtnClicked = (id) => {
        document.getElementById('para' + id).setAttribute("hidden", "true");
        document.getElementById('edit' + id).setAttribute("hidden", "true");
        document.getElementById('textarea' + id).removeAttribute("hidden");
        document.getElementById('done' + id).removeAttribute("hidden");
    }

    const doneBtnClicked = (id) => {
        document.getElementById('para' + id).removeAttribute("hidden");
        document.getElementById('edit' + id).removeAttribute("hidden");
        document.getElementById('textarea' + id).setAttribute("hidden", "true");
        document.getElementById('done' + id).setAttribute("hidden", "true");
        console.log(document.getElementById(`textarea${id}`).value);
    }


    useEffect(() => {
        loadIGDB();
        loadData();
        loadGames();


    }, []);



    return (
        <div>
            <div>
                <p>Sort by</p>
                <select name="sortOptions" value={selectedOption} onChange={optionsChange}>
                    <option value="game_name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="release_date">Release Date</option>
                </select>
                <button onClick={loadGames}>Go</button>
            </div>
            <div>
                {data === "" ? (<h2>...Loading</h2>) : (<h2>{data}</h2>)}

            </div>
            <ul>
                {games.map((game) => (
                    <li key={game.key}>
                        <h2>{game.game_name}</h2>
                        <h3>Release Date: {game.release_date}</h3>
                        <h3>Summary:</h3>
                        <p>{game.summary}</p>
                        <h3>Rating: {game.rating}</h3>
                        <h3>Review:</h3>
                        <p className='review-para' id={`para${game.id}`}>{game.review}</p>
                        <textarea hidden='true' className='review-textarea' id={`textarea${game.id}`} value={game.review}>{game.review}</textarea>
                        <button onClick={() => doneBtnClicked(game.id)} hidden="true" className='done-btn' id={`done${game.id}`}>Done</button>
                        <button onClick={() => reviewBtnClicked(game.id)} className="edit-revew-btn" id={`edit${game.id}`}>Edit review</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}



