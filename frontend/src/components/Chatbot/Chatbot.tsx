import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { knowledgeBase } from '@/data/chatbotData';
import { cn } from '@/lib/utils';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial greeting message when chat opens for the first time
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ text: knowledgeBase.greeting.answer as string, sender: 'bot' }]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen]);

  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    for (const key in knowledgeBase) {
      if (key !== 'default') {
        const entry = knowledgeBase[key];
        for (const keyword of entry.keywords) {
          if (lowerInput.includes(keyword)) {
            const answers = Array.isArray(entry.answer) ? entry.answer : [entry.answer];
            return answers[Math.floor(Math.random() * answers.length)];
          }
        }
      }
    }
    return knowledgeBase.default.answer as string;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = { text: getBotResponse(inputValue), sender: 'bot' };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleToggle = () => setIsOpen(!isOpen);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <>
      <Button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg z-50 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600"
        onClick={handleToggle}
      >
        {isOpen ? <X className="w-8 h-8 text-slate-900" /> : <MessageSquare className="w-8 h-8 text-slate-900" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-full max-w-sm">
          <Card className="glass-card shadow-2xl animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <CardTitle className="gradient-text text-lg">Everest Assistant</CardTitle>
                  <p className="text-xs text-green-400">● Online</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-end space-x-2", { 'justify-end': msg.sender === 'user' })}>
                      {msg.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-yellow-400" />
                        </div>
                      )}
                      <div className={cn("px-4 py-2 rounded-lg max-w-xs", {
                        "bg-yellow-400 text-slate-900 rounded-br-none": msg.sender === 'bot',
                        "bg-slate-700 text-white rounded-bl-none": msg.sender === 'user',
                      })}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-end space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="px-4 py-2 rounded-lg bg-yellow-400 text-slate-900 rounded-br-none">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center space-x-2">
                <Input 
                  placeholder="Type your message..." 
                  className="bg-white/5 border-white/10 text-white" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                />
                <Button onClick={handleSendMessage} disabled={isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Chatbot; 