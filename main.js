const sendChatButton = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");
const chatBotTogler = document.querySelector(".chatbot-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessge;
const API_KEY = "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";
const inputIntHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p> ` : `<span class="material-symbols-outlined">smart_toy</span><p></p> `;
    chatli.innerHTML = chatContent;
    chatli.querySelector("p").textContent = message;
    return chatli;
}

const generateResponse = (incomingChatLi) => {
    const ApiUrlOpenAI = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` // Ensure there's a space after 'Bearer'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessge }]
        })
    };

    // Send POST request to API to get the response
    fetch(ApiUrlOpenAI, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch(error => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try agin later.🤣";
        }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}


const handleChat = () => {
    userMessge = chatInput.value.trim();
    // console.log(userMessge);
    if (!userMessge) return;
    chatInput.value = "";
    chatInput.style.height = `${inputIntHeight}px`;

    chatBox.appendChild(createChatLi(userMessge, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputIntHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});


sendChatButton.addEventListener("click", handleChat);
chatBotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatBotTogler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
