/* =========================
   SUPER AI.JS COMPLETE
   ========================= */

let knowledgeJSON = [];
let adCounter = 0;


/* =========================
   LOAD AI.JSON
   ========================= */

async function initAI() {

    try {

        const response = await fetch('ai.json');

        if (response.ok) {

            knowledgeJSON = await response.json();

            console.log("Knowledge Brain Loaded");

        }

    } catch (err) {

        console.log("ai.json not found");

    }

}


/* =========================
   CASE INSENSITIVE SEARCH
   ========================= */

function searchJSON(query) {

    let words =
    query.toLowerCase().split(/\s+/);

    let bestMatch = null;

    let highestScore = 0;


    for (let item of knowledgeJSON) {

        let score = 0;

        for (let w of words) {

            for (let k of item.keywords) {

                if (
                k.toLowerCase() === w.toLowerCase()
                ) {

                    score++;

                }

            }

        }


        if (score > highestScore) {

            highestScore = score;

            bestMatch = item.answer;

        }

    }


    if (highestScore > 0)

    return bestMatch;

    return null;

}



/* =========================
   AI ENGINE
   ========================= */

/* =========================
   SAFE AI ENGINE
   ========================= */

async function askAI(query){

    let q = query.toLowerCase();

    /* LOCAL AI */

    let local = searchJSON(query);

    if(local)
    return String(local);



    /* IMAGE AI */

    if(
    q.includes("image") ||
    q.includes("draw") ||
    q.includes("generate")
    ){

        let seed = Math.random();

        return `
        <img
        src="https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?seed=${seed}"
        style="width:100%;border-radius:10px;">
        `;

    }



    /* WIKIPEDIA */

    try{

        let searchResponse = await fetch(

        "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="

        +encodeURIComponent(query)+

        "&format=json&origin=*"

        );

        let searchData = await searchResponse.json();



        if(
        searchData &&
        searchData.query &&
        searchData.query.search &&
        searchData.query.search.length>0
        ){

            let title =
            searchData.query.search[0].title;



            let pageResponse =
            await fetch(

            "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles="

            +encodeURIComponent(title)+

            "&format=json&origin=*"

            );



            let pageData =
            await pageResponse.json();



            let pages =
            pageData.query.pages;



            let page =
            pages[
            Object.keys(pages)[0]
            ];



            if(
            page &&
            page.extract &&
            page.extract.length>0
            ){

                return "<b>"+title+"</b><br><br>"

                +page.extract.substring(0,400)

                +"...";

            }

        }

    }

    catch(e){

        console.log("Wiki error",e);

    }



    /* DEFAULT */

    return "No answer found.";

}


/* =========================
   AD SYSTEM
   ========================= */

function insertAd(){

    const chat =
    document.getElementById("chat-body");

    if(!chat) return;


    const ad =
    document.createElement("div");


    ad.style.width="100%";

    ad.style.marginTop="10px";

    ad.style.marginBottom="10px";

    ad.style.display="flex";

    ad.style.justifyContent="center";



    ad.innerHTML=`

    <div
    
    style="
    
    width:95%;
    
    height:90px;
    
    background:#f1f5f9;
    
    border-radius:12px;
    
    display:flex;
    
    align-items:center;
    
    justify-content:center;
    
    font-size:14px;
    
    color:#444;
    
    border:1px solid #ddd;
    
    "
    
    >
    
    Advertisement
    
    </div>
    
    `;


    chat.appendChild(ad);


    chat.scrollTop=

    chat.scrollHeight;

}



/* =========================
   CHAT UI
   ========================= */

function appendMessage(text,isUser){

    const chat =
    document.getElementById("chat-body");


    const msg =
    document.createElement("div");



    msg.style.padding="12px 18px";

    msg.style.marginBottom="15px";

    msg.style.maxWidth="85%";

    msg.style.lineHeight="1.5";


    if(isUser){

        msg.style.background="#e2e8f0";

        msg.style.color="#1e293b";

        msg.style.borderRadius=

        "20px 20px 5px 20px";

        msg.style.alignSelf="flex-end";

        msg.innerText=text;

    }

    else{

        msg.style.background="#ef4444";

        msg.style.color="white";

        msg.style.borderRadius=

        "20px 20px 20px 5px";

        msg.style.alignSelf="flex-start";

        msg.innerHTML=text;

    }



    chat.appendChild(msg);


    chat.scrollTop=

    chat.scrollHeight;



    /* AD COUNTER */

    adCounter++;



    if(adCounter%3===0){

        insertAd();

    }


}



/* =========================
   SEND MESSAGE
   ========================= */

async function handleSend(){


    const input =
    document.getElementById("userInput");


    let text =
    input.value.trim();


    if(!text) return;



    appendMessage(text,true);


    input.value="";



    const thinking=
    document.createElement("div");


    thinking.innerText="...";


    thinking.style.marginBottom="10px";


    document

    .getElementById("chat-body")

    .appendChild(thinking);




    let reply =
    await askAI(text);



    thinking.remove();



    appendMessage(reply,false);


}



/* =========================
   START
   ========================= */

document.addEventListener(

"DOMContentLoaded",

()=>{


initAI();



document

.querySelector(".send-btn")

.onclick=handleSend;



document

.getElementById("userInput")

.addEventListener(

"keypress",

e=>{

if(e.key==="Enter")

handleSend();

}

);


});
