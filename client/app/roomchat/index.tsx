import React from "react";
import { Bell, FileText, MessageCircle, Paperclip, Send, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoomChatApplication(): JSX.Element {
  // Teams data
  const teams = [
    { id: 1, name: "Google", color: "bg-[#8a91d7]", initial: "G" },
    { id: 2, name: "Slack", color: "bg-[#df36a1]", initial: "S" },
    { id: 3, name: "Upwork", color: "bg-[#101973]", initial: "U" },
    { id: 4, name: "Fiver", color: "bg-[#9c157f]", initial: "F" },
    { id: 5, name: "Amazon", color: "bg-[#1d5742]", initial: "A" },
  ];

  // Chats data
  const chats = [
    { id: 1, name: "Jodye", message: "Hey, how is going? Everything is fine?", time: "18.27", unread: 2 },
    { id: 2, name: "Felly", message: "Hey, how is going? Everything is fine?", time: "18.20" },
    { id: 3, name: "Becca", message: "Hey, how is going? Everything is fine?", time: "18.03" },
    { id: 4, name: "Horner", message: "Hey, how is going? Everything is fine?", time: "17.56", unread: 2 },
    { id: 5, name: "Bica", message: "Hey, how is going? Everything is fine?", time: "17.01" },
  ];

  // Messages data
  const messages = [
    { id: 1, sender: "Jodye", content: "helloo Jonathan.", time: "15 May 2025, 18.15", isSelf: false },
    {
      id: 2,
      sender: "Jodye",
      content: "Hey, how is going?Everything is fine?",
      time: "15 May 2025, 18.17",
      isSelf: false,
    },
    { id: 3, sender: "Jonathan", content: "helloo Jodye, i;m fine..", time: "15 May 2025, 18.27", isSelf: true },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] h-[1024px] relative">
        {/* Left Navigation Bar */}
        <nav className="absolute w-[103px] h-[1024px] top-[3px] left-0 bg-neutral-200">
          <div className="absolute w-[45px] h-[45px] top-9 left-[29px]">
            <MessageCircle size={45} />
          </div>
          <div className="absolute w-[47px] h-[279px] top-72 left-7 flex flex-col gap-5">
            <Button variant="ghost" size="icon" className="w-[45px] h-[45px] p-0">
              <Settings size={45} />
            </Button>
            <Button variant="ghost" size="icon" className="w-[45px] h-[45px] p-0">
              <FileText size={45} />
            </Button>
            <Button variant="ghost" size="icon" className="w-[45px] h-[45px] p-0">
              <MessageCircle size={45} />
            </Button>
            <Button variant="ghost" size="icon" className="w-[45px] h-[45px] p-0">
              <Settings size={45} />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="absolute w-[45px] h-[45px] top-[945px] left-[29px] p-0">
            <User size={45} />
          </Button>
        </div>
        {/* Chat List Panel */}
        <div className="absolute w-[426px] h-[1024px] top-[3px] left-[103px] bg-[#f4f4f4]">
          <header className="p-6">
            <h1 className="text-5xl font-medium text-text-black">Chat</h1>
          </header>
          {/* Jonathan Profile */}
          <div className="flex flex-col items-center mt-8">
            <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
              <AvatarImage src="" alt="Jonathan" />
              <AvatarFallback className="text-4xl">
                <User size={64} />
              </AvatarFallback>
            </Avatar>
            <div className="relative">
              <div className="w-[13px] h-[13px] rounded-[6.5px] bg-[#6abb82] absolute -bottom-1 right-0" />
            </div>
            <h2 className="mt-4 font-medium text-text-black text-lg">Jonathan</h2>
            <Badge className="mt-2 bg-[#c8f0dc] text-[#6dc06f] font-medium px-4 py-1 rounded-[5px]">Active</Badge>
          </div>
          {/* Teams Section */}
          <section className="mt-12 px-3">
            <h2 className="font-medium text-text-black text-lg mb-4">Teams</h2>
            <div className="flex gap-4 flex-wrap">
              {teams.map((team) => (
                <div key={team.id} className="flex flex-col items-center">
                  <Avatar className={`w-[70px] h-[70px] ${team.color} rounded-[35px]`}>
                    <AvatarFallback className="text-[25px] text-[#cac7c7]">{team.initial}</AvatarFallback>
                  </Avatar>
                  <span className="mt-2 text-text-gray text-lg">{team.name}</span>
                </div>
              ))}
            </div>
          </section>
          {/* Chats Section */}
          <section className="mt-12 px-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-text-black text-lg">Chats</h2>
              <Button variant="ghost" size="icon" className="h-auto p-1">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 0V15M0 7.5H15" stroke="currentColor" strokeWidth="2" />
                </svg>
              </Button>
            </div>
            {/* Chat Tabs */}
            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="px-2 py-0 h-auto data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="px-2 py-0 h-auto data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none"
                >
                  New
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Search Input */}
            <div className="relative mb-4">
              <Input
                placeholder="Search"
                className="bg-white rounded-[10px] shadow-[0px_2px_9px_#c2c2c240] h-[41px] pl-4"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.5 14.5L10.5 10.5M12 6.5C12 9.53757 9.53757 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </div>
            {/* Chat List */}
            <div className="space-y-4">
              {chats.map((chat) => (
                <div key={chat.id} className="flex items-center gap-3">
                  <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc] rounded-[24.5px]">
                    <AvatarImage src="" alt={chat.name} />
                    <AvatarFallback>
                      <User size={28} />
                    </AvatarFallback>
                    <div className="absolute w-1.5 h-1.5 bottom-1 right-1 bg-[#6abb82] rounded-[3px] border border-solid border-[#efecec]" />
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-black text-lg">{chat.name}</h3>
                    <p className="text-text-gray text-[13px]">{chat.message}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-text-gray text-[10px]">{chat.time}</span>
                    {chat.unread && (
                      <div className="w-[15px] h-[15px] bg-[#d9d9d9] rounded-[7.5px] flex items-center justify-center mt-1">
                        <span className="text-text-gray text-[10px]">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* Main Chat Area */}
        <div className="absolute w-[518px] h-[1021px] top-[3px] left-[424px] bg-white border-l border-r border-gray-200">
          {/* Chat Header */}
          <header className="h-[99px] bg-[#efecec] flex items-center px-4">
            <Avatar className="w-[49px] h-[49px]">
              <AvatarImage src="" alt="Jodye" />
              <AvatarFallback>
                <User size={23} />
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="font-medium text-text-black text-lg">Jodye</h2>
              <span className="text-[#6dc06f] text-[10px] font-medium">Active</span>
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-[53px] h-[53px] rounded-[10px] bg-[#d9d9d9] border-none"
              >
                <Bell size={24} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-[53px] h-[53px] rounded-[10px] bg-[#d9d9d9] border-none"
              >
                <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2H16" stroke="black" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </Button>
            </div>
          </header>
          {/* Chat Messages */}
          <div className="p-4 h-[calc(100%-180px)] overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-8">
                <div className="text-text-gray text-[13px] mb-2">{message.time}</div>
                <div className={`flex ${message.isSelf ? "justify-end" : "justify-start"}`}>
                  {!message.isSelf && (
                    <Avatar className="w-[49px] h-[49px] mr-3">
                      <AvatarImage src="" alt={message.sender} />
                      <AvatarFallback>
                        <User size={23} />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <Card
                    className={`relative max-w-[237px] ${
                      message.isSelf ? "bg-[#efecec]" : "bg-[#efecec]"
                    } shadow-[0px_4px_4px_#00000040] border-none`}
                  >
                    <CardContent className="p-4">
                      <p className="text-text-black text-[13px]">{message.content}</p>
                    </CardContent>
                    <div className={`absolute top-1/2 -mt-3 ${message.isSelf ? "right-[-15px]" : "left-[-15px]"}`}>
                      <svg width="31" height="28" viewBox="0 0 31 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={message.isSelf ? "M0 0L30 14L0 28V0Z" : "M31 0L1 14L31 28V0Z"} fill="#efecec" />
                      </svg>
                    </div>
                  </Card>
                  {message.isSelf && (
                    <Avatar className="w-[49px] h-[49px] ml-3">
                      <AvatarImage src="" alt="Jonathan" />
                      <AvatarFallback>
                        <User size={23} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-auto p-1 ml-auto block">
                  <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2H16" stroke="black" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
          {/* Typing Indicator */}
          <div className="absolute bottom-[70px] left-[445px] flex items-center gap-3">
            <Avatar className="w-[49px] h-[49px]">
              <AvatarFallback>
                <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2H16" stroke="black" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </AvatarFallback>
            </Avatar>
            <span className="text-text-black text-[13px]">Jodye is typing</span>
          </div>
          {/* Message Input */}
          <div className="absolute bottom-[15px] left-[445px] w-[476px]">
            <div className="relative">
              <Input placeholder="Type here" className="bg-[#efecec] rounded-[10px] h-11 pr-[100px]" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-[80px] top-1/2 transform -translate-y-1/2 h-auto p-1"
              >
                <Paperclip size={24} />
              </Button>
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-[23px] bg-main rounded-[5px] px-3 py-0 flex items-center gap-1">
                <span className="text-[#efecec] text-[13px] font-medium">send</span>
                <Send size={15} />
              </Button>
            </div>
          </div>
        </div>
        {/* Right Profile Panel */}
        <div className="absolute w-[395px] h-[1024px] top-0 right-0 p-6">
          {/* Jodye Profile */}
          <div className="flex flex-col items-center mt-[110px]">
            <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
              <AvatarImage src="" alt="Jodye" />
              <AvatarFallback className="text-4xl">
                <User size={64} />
              </AvatarFallback>
            </Avatar>
            <div className="relative">
              <div className="w-[13px] h-[13px] rounded-[6.5px] bg-[#6abb82] absolute -bottom-1 right-0" />
            </div>
            <h2 className="mt-4 font-medium text-text-black text-lg">Jodye</h2>
            <Badge className="mt-2 bg-[#c8f0dc] text-[#6dc06f] font-medium px-4 py-1 rounded-[5px]">Active</Badge>
            <Button className="mt-6 w-10 h-10 bg-[#c8f0dc] rounded-[20px] p-0">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 14H2V4L10 9L18 4V14ZM10 7L2 2H18L10 7Z"
                  fill="#6dc06f"
                />
              </svg>
            </Button>
          </div>
          {/* Shared Files */}
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-[#d9d9d9] rounded-[5px] flex items-center justify-center">
                <FileText size={20} />
              </div>
              <span className="text-text-black text-[13px]">Resume template.pdf</span>
              <span className="text-text-black text-[13px] ml-auto">3.3 Mb</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
