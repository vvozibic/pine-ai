import { useState } from "react";

const SYSTEM_PROMPT = `Ты помощник по Pine Script. Помогай пользователю писать и оптимизировать стратегии для трейдинга.`;

export function useChat() {
  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_PROMPT },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userInput: string) => {
    const updatedMessages = [...messages, { role: "user", content: userInput }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userInput,
          knowledge_base_id: "18368cd0-c768-4c20-b407-548e9ab362bc",
          // "prompt": "Optional parameter. If not passed, the default prompt will be used."
        }),
      });

      const { data } = await response.json();
      console.log(data);
      const assistantReply = data.answer || "Ошибка";

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: assistantReply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Что-то пошло не так 😕" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages: messages.slice(1), sendMessage, loading };
}
