
import { sql } from '@vercel/postgres';

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

export default async function handler(req, res) {
    try {
        const authReponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
            method: 'POST'
        });
        const authData = await authReponse.json();
        const access_token = authData.access_token;

        const gameNameQuery = await sql`select game_name from game_list`;
        gameNameQuery.rows.forEach(async (item) => {
            const game_response = await fetch(`https://api.igdb.com/v4/games`, {
                method: 'POST',
                headers: {
                    'Client-ID': `${clientId}`,
                    'Authorization': `Bearer ${access_token}`
                },
                body: `search "${item.game_name}"; fields *;`
            });

            const gameData = await game_response.json();
            if (gameData !== undefined) {
                const gameSummary = gameData[0].summary;
                const releaseDate = gameData[0].first_release_date;
                const rating = (gameData[0].rating).toFixed(2);

                let unix_timestamp = releaseDate;
                var milliseconds = new Date(unix_timestamp * 1000);
                var year = milliseconds.getFullYear();
                var date = milliseconds.getDate();
                var month = milliseconds.getMonth() + 1;
                var time = year + "/" + ('0' + month).slice(-2) + "/" + ('0' + date).slice(-2);

                const updateQuery = await sql`update game_list set  
                summary = ${gameSummary},
                rating = ${rating},
                release_date = ${time}
                where game_name = ${item.game_name};
                `;

                return res.status(200).json({ text: "Working" });
            }
            else {
                return res.status(500).json({ text: "error sending request to igdb" })
            }
        })
    }
    catch (error) {
        return res.status(500).json({ text: "failed to fetch igdb data" })
    };

}
