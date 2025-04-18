import { useState, useRef, useEffect } from 'react';
import { Input, Button, Typography, Spin } from 'antd';
import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { PromptName } from '@/utils/prompts';

interface Message {
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

const Chat = ({ onSummaryCreated, getCurrentDescription, prompts }: { onSummaryCreated: (summary: string) => void, getCurrentDescription: () => string, prompts: Record<PromptName, string> }) => {

    const [messages, setMessages] = useState<Message[]>([
        {
            content: "Hi there! Ready to bring your app idea to life? Let's turn that brilliant concept into your next success story—what are we building today?",
            role: 'assistant',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const getPrompts = () => {
        const STORAGE_KEY_PROMPTS = 'app_prompts'
        const savedPrompts = localStorage.getItem(STORAGE_KEY_PROMPTS)
        return savedPrompts ? JSON.parse(savedPrompts) : prompts;
    }

    const createNextMessage = async (message: string) => {
        const _prompts = getPrompts();
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ messages: [...messages, { role: 'user' as const, content: message }], customPrompt: _prompts.chat }),
        });
        const data = await response.json();
        const aiMessage = {
            content: data.message,
            role: 'assistant' as const,
            timestamp: new Date(),
        }
        setMessages(prev => [...prev, aiMessage]);
        return aiMessage;
    }

    const createSummary = async () => {
        const _prompts = getPrompts();
        const response = await fetch('/api/summary', {
            method: 'POST',
            body: JSON.stringify({ conversation: messages, previousDescription: getCurrentDescription(), customPrompt: _prompts.summary }),
        });
        const data = await response.json();
        onSummaryCreated(data.summary);
    }

    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            createSummary();
        }
    }, [messages, onSummaryCreated]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (input.trim() === '') return;

        // Add user message
        const userMessage: Message = {
            content: input,
            role: 'user',
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInput('');
        setIsLoading(true); // Set loading state to true before API call

        createNextMessage(input)
            .finally(() => {
                setIsLoading(false); // Set loading state to false after API call completes
            });
    };

    const renderMessages = () => {
        return messages.map((message, index) => {
            const isUser = message.role === 'user';

            return (
                <div
                    key={index}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                    <div
                        className={`max-w-[80%] ${isUser
                            ? 'bg-gray-100 text-gray-800 rounded-lg py-3 px-5 m-5'
                            : 'bg-white text-gray-800 rounded-lg py-3 px-5'
                            } text-lg`}
                    >
                        {message.content}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-0 bg-white" ref={chatContainerRef}>
                {renderMessages()}
                {isLoading && (
                    <div className="flex justify-start mb-4 p-5">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#f5222d' }} spin />} size="small" />
                    </div>
                )}  
            </div>
            <div className="flex mt-auto p-4">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={handleSend}
                    placeholder="Type your message..."
                    className="flex-grow text-lg py-2 px-4"
                    size="large"
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    className="ml-3"
                    size="large"
                />
            </div>
        </div>
    );
};

export default Chat; 