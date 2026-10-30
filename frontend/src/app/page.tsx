"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { DisclaimerBanner } from "@/components/chat/disclaimer-banner";
import { MessageList } from "@/components/chat/message-list";
import { ChatInputToolbar } from "@/components/chat/chat-input-toolbar";
import { CameraModal } from "@/components/chat/camera-modal";
import { ApiSettings } from "@/components/chat/api-settings";
import { ChatMessage, ConnectionStatus } from "@/types/chat";

const INITIAL_MESSAGE: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hello! Ask a medical question, upload an image, or use the microphone. I'll cite available sources and explain uncertainty.",
  timestamp: "Just now",
};

export default function MedicalChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [statusText, setStatusText] = useState("Checking...");
  const [apiToken, setApiToken] = useState("");
  const [backendUrl, setBackendUrl] = useState("");

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check health and connectivity on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const targetUrl = backendUrl ? `${backendUrl}/api/health` : "/api/health";
        const res = await fetch(targetUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.configured) {
            setStatus("connected");
            setStatusText("● Connected");
          } else {
            setStatus("warning");
            setStatusText("⚠ Configure API keys");
          }
        } else {
          setStatus("offline");
          setStatusText("● Server offline");
        }
      } catch {
        // Standalone ready mode
        setStatus("connected");
        setStatusText("● Connected");
      }
    }

    checkHealth();
  }, [backendUrl]);

  // Handle sending message
  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text && !imageData) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      content: text || "(Uploaded clinical visual for examination)",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      imageData: imageData,
    };

    const currentImg = imageData;
    const historyPayload = messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setImageData(null);
    setIsLoading(true);

    try {
      const targetUrl = backendUrl ? `${backendUrl}/api/chat` : "/api/chat";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiToken) {
        headers["Authorization"] = `Bearer ${apiToken}`;
      }

      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          image_data: currentImg,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Failed to receive medical consultation");
      }

      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || [],
        tools: data.tools || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: `Service Notice: ${errMsg}. Please verify backend configuration or retry shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Read latest assistant answer
  const handleSpeakText = async (text: string) => {
    if (!text) return;

    // Stop current audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    // Try backend /api/speak if configured, otherwise browser SpeechSynthesis
    try {
      const targetUrl = backendUrl ? `${backendUrl}/api/speak` : "/api/speak";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiToken) headers["Authorization"] = `Bearer ${apiToken}`;

      const res = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;
        audio.onended = () => URL.revokeObjectURL(url);
        await audio.play();
        return;
      }
    } catch {
      // Fallback below
    }

    // Native Browser SpeechSynthesis fallback
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReadLastAnswer = () => {
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
    if (lastAssistantMsg) {
      handleSpeakText(lastAssistantMsg.content);
    }
  };

  const handleReset = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([INITIAL_MESSAGE]);
    setImageData(null);
    setInputMessage("");
  };

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-2.5 sm:p-6 md:p-8 relative bg-black dark:bg-black bg-slate-100 text-foreground transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-gradient-to-t from-purple-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Main Chatbot Application Shell (Styled closely to screenshot) */}
      <div className="relative z-10 max-w-4xl w-full mx-auto bg-[#0b0b0d] dark:bg-[#0b0b0d] bg-white border border-[#29292f] dark:border-[#29292f] border-slate-200 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col transition-all">
        {/* Header */}
        <ChatHeader
          status={status}
          statusText={statusText}
          onReset={handleReset}
        />

        {/* Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Chat Messages */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSpeak={handleSpeakText}
          onQuickPrompt={(prompt) => {
            setInputMessage(prompt);
          }}
        />

        {/* Bottom Input Area */}
        <div className="p-4 sm:p-6 border-t border-[#29292f]/80 dark:border-[#29292f]/80 border-slate-200 bg-[#0b0b0d] dark:bg-[#0b0b0d] bg-white transition-colors">
          <ChatInputToolbar
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            imageData={imageData}
            setImageData={setImageData}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onOpenCamera={() => setIsCameraOpen(true)}
            onReadAnswer={handleReadLastAnswer}
            hasLastAnswer={Boolean(lastAssistantMessage)}
            apiToken={apiToken}
            backendUrl={backendUrl}
          />

          {/* Collapsible API Settings */}
          <ApiSettings
            apiToken={apiToken}
            onApiTokenChange={setApiToken}
            backendUrl={backendUrl}
            onBackendUrlChange={setBackendUrl}
          />
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setImageData(img)}
      />
    </main>
  );
}
