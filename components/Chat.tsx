import { useState, useRef, useEffect } from 'react';
import { Input, Button, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface Message {
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

const Chat = ({ onSummaryCreated }: { onSummaryCreated: (summary: string) => void }) => {
    const [currentDescription, setCurrentDescription] = useState('');

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

    const createNextMessage = async (message: string) => {
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ messages: [...messages, { role: 'user' as const, content: message }] }),
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
        const response = await fetch('/api/summary', {
            method: 'POST',
            body: JSON.stringify({ conversation: messages, previousDescription: currentDescription }),
        });
        const data = await response.json();
        setCurrentDescription(data.summary);
        onSummaryCreated(data.summary);
    }

    useEffect(() => {
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
            createSummary();
        }
    }, [messages, onSummaryCreated]);

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

        createNextMessage(input);
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
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-lg py-3 px-5 text-gray-800">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex mt-auto p-4 bg-gray-50 border-t">
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