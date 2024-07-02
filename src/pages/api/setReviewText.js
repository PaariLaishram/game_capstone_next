
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const data = req.body;
    const id = data.gameId;
    const reviewText = data.text;
    try {
        const query = await sql`update game_list set review = ${reviewText} where game_id = ${id} returning review;`;
        if (query.rows != 0) {
            console.log("review updated")
            return res.status(200).json({ text: "Updated game review" })
        }
        else {
            return res.status(500).json({ text: "There was an error updating the game review" });
        }
    } catch (error) {
        return res.status(500).json({ text: "unable to resolve review change api" })
    }

}
