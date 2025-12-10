const router=require('express').Router();
const { error } = require('../utils/Error');
const {model}=require('../utils/Genrativeclien.js');

router.post('/ask',async(req,res)=>{
    try{
        console.log("ai")
        const topic=req.query.topic;
        const action=req.query.action;
        console.log(topic)
        if(!topic)return error(res,400,{message:"no prompt was given"});
        let prompt="";
        if(action=="explain"){
          prompt = `You are a helpful teaching assistant. Explain the following topic in a simple, clear, and beginner-friendly way.

Requirements:
- Start with a short summary
- Explain all key concepts
- Use easy language
- Add real-life examples
- Add diagrams in text form if useful
- Avoid difficult words
- Keep tone friendly and educational
- Make the explanation understandable for students

Topic:\n\n${topic}`;
        }
        else if (action=="qa"){
             prompt = `You are an expert teaching assistant. Generate a set of questions and answers to help a student understand the concept provided below. 

Requirements:
1. Provide at least 5 questions.
2. Include the answer for each question.
3. Keep answers simple, clear, and beginner-friendly.
4. Cover the main points of the topic.
5. Include examples if needed.
6. Format the output strictly in valid JSON as below:

format: [{"question": "...", "answer": "..."}]. Return ONLY JSON.

Topic:\n\n${topic}`;


        }
         console.log("prompt",prompt)
        const  result= await model.generateContent(prompt)
        const text= result.response.text();
;
        
    //    const text = result.text();

    return res.status(200).json({
      success: true,
      data: text
    });
       
    }
    catch(e){
       const status = e.status || e.response?.status;

    if (status === 429) {

        console.log(e);
        return error(res,429,{message:"interbal server"})
    }
    return error(res,500,{message:"interbal server"})
}
})

module.exports =router;