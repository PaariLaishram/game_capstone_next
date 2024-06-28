import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    const option = req.body;
   switch(option){
    case 'game_name':
        try{
            const query = await sql `SELECT * FROM game_list ORDER BY game_name ASC`;
            return res.status(200).json(query.rows)
        }
        catch(error){
            return res.status(500).json({message:"500 error"})
        }

        case 'rating':
            try{
                const query = await sql `SELECT * FROM game_list ORDER BY rating desc`;
                return res.status(200).json(query.rows)
            }
            catch(error){
                return res.status(500).json({message:"500 error"})
            }
            case  'release_date':
                try{
                    const query = await sql `SELECT * FROM game_list ORDER BY release_date desc`;
                    return res.status(200).json(query.rows)
                }
                catch(error){
                    return res.status(500).json({message:"500 error"})
                }            
}
  
}


