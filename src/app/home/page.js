"use client";
import React, { useState } from 'react';
import { useEffect } from 'react';
import classes from "./page.module.css"




export default function HomePage() {
    const [selectedOption, setSelectedOption] = useState("game_name");
    const [data, setData] = useState("");
    let [games, setGames] = useState([]);
    const [text, setText] = useState("");
    const [reviewId, setReviewId] = useState("");
    const [loading, setLoading] = useState(true);
    const [focusText, setFocusText] = useState("");


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

    const loadGames = async () => {
        try {
            const response = await fetch("/api/getGames", {
                method: 'POST',
                body: selectedOption
            });
            if (response.ok) {
                setLoading(false);
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
        setSelectedOption(option);
    }

    const reviewBtnClicked = (id) => {
        document.getElementById('para' + id).setAttribute("hidden", "true");
        document.getElementById('edit' + id).setAttribute("hidden", "true");
        document.getElementById('textarea' + id).removeAttribute("hidden");
        document.getElementById('done' + id).removeAttribute("hidden");
    }

    const textChange = (event) => {
        const text = event.target.value;
        setText(text);

    }
    const compareText = (blurText) => {
        console.log(focusText, blurText)
        if (focusText === blurText) {
            setText(focusText);
        }
    }



    const doneBtnClicked = async (id) => {
        document.getElementById('para' + id).removeAttribute("hidden");
        document.getElementById('edit' + id).removeAttribute("hidden");
        document.getElementById('textarea' + id).setAttribute("hidden", "true");
        document.getElementById('done' + id).setAttribute("hidden", "true");
        setReviewId(id);
        const response = await fetch('/api/setReviewText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    text: text,
                    gameId: id
                }
            )
        });
        if (response.ok) {
            setLoading(false)
        }
        const textLoading = () => {
            document.getElementById('para' + id).innerHTML = '...Loading';
        }
        textLoading();

        const changePara = () => {
            setTimeout(() => {
                loadGames();
            }, "1500");
        }
        changePara();
    }

    useEffect(() => {
        loadIGDB();
        loadGames();

    }, []); // useEffect will run only once 

    return (
        loading ? <h1>Loading...</h1> : (
            <div id="Home">
                <div className={classes.navbar}>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About Me</a></li>
                        <li><a href="#">Contacts</a></li>
                    </ul>
                    <h1><a href="#">My top 5 games of all times</a></h1>
                </div>
                <div className={classes.container}>
                    <div class={classes.intro} id="Intro">
                        <h1>A little bit about me</h1>
                        <p>Hi there! I am Paari Laishram. I am a vivid gamer and I have been gaming since i was 12. I remember playing native windows XP games like Solitaire on our first laptop that my family bought. Over the years, my passion for gaming has evolved, and I've encountered countless memorable experiences. Here is a list of my top five all-time favorite games.</p></div>
                    <hr style={{ width: "91%" }} />
                    <div className={classes.filter}>
                        <p>Sort by</p>
                        <select name="sortOptions" value={selectedOption} onChange={optionsChange}>
                            <option value="game_name">Name</option>
                            <option value="rating">Rating</option>
                            <option value="release_date">Release Date</option>
                        </select>
                        <button onClick={loadGames}>Go</button>
                    </div>
                    <div className={classes.content}>
                        <ul>
                            {games.map((game) => (
                                <li key={game.key}>
                                    <h2>{game.game_name}</h2>
                                    <h3>Release Date: {game.release_date}</h3>
                                    <h3>Summary:</h3>
                                    <p>{game.summary}</p>
                                    <h3>Rating: {game.rating}</h3>
                                    <h3>Review:</h3>
                                    <p className='review-para' id={`para${game.key}`}>{game.review}</p>
                                    <textarea hidden={true} className={classes.editTextArea} id={`textarea${game.key}`} onFocus={(e) => { const initalText = e.target.value; setFocusText(initalText) }} onBlur={(e) => { const text = e.target.value; compareText(text) }} onChange={textChange} defaultValue={game.review}></textarea>
                                    <button onClick={() => doneBtnClicked(game.key)} hidden={true} className={classes.doneBtn} id={`done${game.key}`}>Done</button>
                                    <button onClick={() => reviewBtnClicked(game.key)} className="edit-revew-btn" id={`edit${game.key}`}>Edit review</button>

                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={classes.footer}>
                    <p>CONTACTS</p>
                    <div className={classes.emailContainer}>
                        <img id={classes.email} src="/images/email.jpg" /><a
                            href="mailto:paarilai05@gmail.com" id={classes.myemail}>{`paarilai05@gmail.com`}</a>
                    </div>
                    <div className={classes.social}>
                        <a href="https://www.linkedin.com/in/paari-laishram-92b7021ba/"><img id={classes.linkedin} src="/images/linkedin.png" alt="LinkedIn" /> </a>
                        <a href="https://github.com/PaariLaishram"><img id={classes.github} src="/images/github.png" alt="Github" /></a>
                    </div>
                </div>
            </div>

        )
    );

}



