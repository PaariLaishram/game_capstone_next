export default async function handler(req, res) {
  if(req.method === 'POST'){
    const {option} = req.body;
    return res.status(200).json({message:"recieved", option})
  }
  else{
    return res.status(405).json({message:"method not allowed"});
  }
  
   
}