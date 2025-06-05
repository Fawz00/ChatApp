import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArchiveIcon,
  BellIcon,
  FileIcon,
  LayoutDashboardIcon,
  MessageCircleIcon,
  MoreVertical,
  PaperclipIcon,
  SendIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import React from "react";

const PengaturanDengan = () => {
  // Chat data for the conversation list
  const chatList = [
    {
      id: 1,
      name: "Jodye",
      message: "Hey, how is going? Everything is fine?",
      time: "18.27",
      unread: 2,
      active: true,
    },
    {
      id: 2,
      name: "Felly",
      message: "Hey, how is going? Everything is fine?",
      time: "18.20",
      unread: 0,
      active: true,
    },
    {
      id: 3,
      name: "Becca",
      message: "Hey, how is going? Everything is fine?",
      time: "18.03",
      unread: 0,
      active: true,
    },
    {
      id: 4,
      name: "Horner",
      message: "Hey, how is going? Everything is fine?",
      time: "17.56",
      unread: 2,
      active: true,
    },
    {
      id: 5,
      name: "Bica",
      message: "Hey, how is going? Everything is fine?",
      time: "17.01",
      unread: 0,
      active: true,
    },
  ];

  // Team data
  const teams = [
    { id: 1, name: "Google", color: "bg-[#8a91d7]", letter: "G" },
    { id: 2, name: "Slack", color: "bg-[#df36a1]", letter: "S" },
    { id: 3, name: "Upwork", color: "bg-[#101973]", letter: "U" },
    { id: 4, name: "Fiver", color: "bg-[#9c157f]", letter: "F" },
    { id: 5, name: "Amazon", color: "bg-[#1d5742]", letter: "A" },
  ];

  // Messages data
  const messages = [
    {
      id: 1,
      sender: "Jodye",
      content: "helloo Jonathan.",
      time: "15 May 2025, 18.15",
      isMe: false,
    },
    {
      id: 2,
      sender: "Jodye",
      content: "Hey, how is going?Everything is fine?",
      time: "15 May 2025, 18.17",
      isMe: false,
    },
    {
      id: 3,
      sender: "Jonathan",
      content: "helloo Jodye, i;m fine..",
      time: "15 May 2025, 18.27",
      isMe: true,
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] h-[1024px] relative">
        {/* Left Sidebar */}
        <aside className="absolute w-[298px] h-[1024px] top-0 left-0 bg-[#d9d9d9]">
          <nav className="flex flex-col h-full">
            <div className="p-7">
              <MessageCircleIcon className="w-[45px] h-[45px]" />
            </div>

            <div className="flex flex-col gap-6 mt-8 px-7">
              <div className="flex items-center gap-4">
                <LayoutDashboardIcon className="w-[45px] h-[45px]" />
                <span className="font-semibold text-black text-3xl">
                  Dashboard
                </span>
              </div>

              <div className="flex items-center gap-4">
                <ArchiveIcon className="w-[45px] h-[45px]" />
                <span className="font-semibold text-black text-3xl">
                  Archive File
                </span>
              </div>

              <div className="flex items-center gap-4">
                <MessageCircleIcon className="w-[45px] h-[45px]" />
                <span className="font-semibold text-black text-3xl">Chats</span>
              </div>

              <div className="flex items-center gap-4">
                <SettingsIcon className="w-[45px] h-[45px]" />
                <span className="font-semibold text-black text-3xl">
                  Settings
                </span>
              </div>
            </div>

            <div className="mt-auto p-7 flex items-center gap-4">
              <UserIcon className="w-[45px] h-[45px]" />
              <span className="font-semibold text-black text-3xl">Profile</span>
            </div>
          </nav>
        </aside>

        {/* Chat List Section */}
        <section className="absolute w-[426px] h-[1024px] top-0 left-[103px] bg-[#f4f4f4]">
          <div className="p-6">
            <h2 className="font-medium text-text-black text-5xl">Chat</h2>

            {/* User Profile */}
            <div className="mt-16 flex flex-col items-center">
              <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
                <AvatarFallback className="text-4xl">J</AvatarFallback>
              </Avatar>
              <div className="w-[13px] h-[13px] rounded-[6.5px] bg-[#6abb82] relative -mt-3 ml-16" />
              <h3 className="mt-4 font-medium text-text-black text-lg">
                Jonathan
              </h3>
              <Badge className="mt-2 bg-[#c8f0dc] text-[#6dc06f] font-medium px-4 py-1 rounded-[5px]">
                Active
              </Badge>
            </div>

            {/* Teams Section */}
            <div className="mt-12">
              <h3 className="font-medium text-text-black text-lg">Teams</h3>
              <div className="flex gap-4 mt-4">
                {teams.map((team) => (
                  <div key={team.id} className="flex flex-col items-center">
                    <div
                      className={`w-[70px] h-[70px] ${team.color} rounded-[35px] flex items-center justify-center`}
                    >
                      <span className="font-medium text-[#cac7c7] text-[25px]">
                        {team.letter}
                      </span>
                    </div>
                    <span className="mt-2 font-medium text-text-gray text-lg">
                      {team.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chats Section */}
            <div className="mt-12">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-text-black text-lg">Chats</h3>
                <MoreVertical className="w-[15px] h-[15px]" />
              </div>

              <div className="flex gap-4 mt-4">
                <span className="font-normal text-main text-[13px]">All</span>
                <span className="font-normal text-text-gray text-[13px]">
                  New
                </span>
              </div>

              {/* Search Input */}
              <div className="mt-2 relative">
                <Input
                  className="bg-white rounded-[10px] shadow-[0px_2px_9px_#c2c2c240] h-[41px] pl-3"
                  placeholder="Search"
                />
                <SearchIcon className="absolute right-3 top-3 w-[15px] h-[15px]" />
              </div>

              {/* Chat List */}
              <div className="mt-6 space-y-4">
                {chatList.map((chat) => (
                  <div key={chat.id} className="flex items-center gap-3">
                    <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc] rounded-[24.5px]">
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.active && (
                      <div className="w-1.5 h-1.5 bg-[#6abb82] rounded-[3px] border border-solid border-[#efecec] absolute ml-[34px] mt-[43px]" />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-text-black text-lg">
                          {chat.name}
                        </h4>
                        <span className="font-normal text-text-gray text-[10px]">
                          {chat.time}
                        </span>
                      </div>
                      <p className="font-normal text-text-gray text-[13px]">
                        {chat.message}
                      </p>
                    </div>

                    {chat.unread > 0 && (
                      <div className="w-[15px] h-[15px] bg-[#d9d9d9] rounded-[7.5px] flex items-center justify-center">
                        <span className="font-normal text-text-gray text-[10px]">
                          {chat.unread}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Chat Area */}
        <section className="absolute w-[518px] h-[1024px] top-0 left-[527px] bg-white">
          {/* Chat Header */}
          <header className="h-[99px] bg-[#efecec] flex items-center px-6">
            <Avatar className="w-[49px] h-[49px]">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h3 className="font-medium text-text-black text-lg">Jodye</h3>
              <Badge className="bg-transparent p-0 text-[#6dc06f] font-medium text-[10px]">
                Active
              </Badge>
            </div>
            <div className="ml-auto flex gap-4">
              <div className="w-[53px] h-[53px] bg-[#d9d9d9] rounded-[10px] flex items-center justify-center">
                <BellIcon className="w-6 h-6" />
              </div>
              <div className="w-[53px] h-[53px] bg-[#d9d9d9] rounded-[10px] flex items-center justify-center">
                <MoreVertical className="w-6 h-6" />
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="p-6 h-[calc(100%-180px)] overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-8">
                <div className="text-text-gray text-[13px] mb-2">
                  {message.time}
                </div>
                <div
                  className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                >
                  {!message.isMe && (
                    <Avatar className="w-[49px] h-[49px] mr-2">
                      <AvatarFallback>J</AvatarFallback>
                    </Avatar>
                  )}
                  <Card
                    className={`max-w-[237px] shadow-[0px_4px_4px_#00000040] ${message.isMe ? "ml-auto" : ""}`}
                  >
                    <CardContent className="p-4 bg-[#efecec] rounded-[10px]">
                      <p className="text-text-black text-[13px]">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                  {message.isMe && (
                    <Avatar className="w-[49px] h-[49px] ml-2">
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Typing Indicator */}
          <div className="absolute bottom-16 left-[548px]">
            <div className="flex items-center gap-3">
              <Avatar className="w-[49px] h-[49px]">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <span className="font-normal text-text-black text-[13px]">
                Jodye is typing
              </span>
            </div>
          </div>

          {/* Message Input */}
          <div className="absolute bottom-6 left-[548px] right-6">
            <div className="relative">
              <Input
                className="w-[476px] h-11 bg-[#efecec] rounded-[10px] pr-24"
                placeholder="Type here"
              />
              <div className="absolute right-12 top-2">
                <PaperclipIcon className="w-6 h-6" />
              </div>
              <Button className="absolute right-0 top-1 h-[23px] bg-main rounded-[5px] px-3">
                <span className="text-[#efecec] text-[13px] mr-1">send</span>
                <SendIcon className="w-[15px] h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Right Sidebar - User Profile */}
        <aside className="absolute right-0 top-0 w-[300px] h-full p-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
              <AvatarFallback className="text-4xl">J</AvatarFallback>
            </Avatar>
            <div className="w-[13px] h-[13px] rounded-[6.5px] bg-[#6abb82] relative -mt-3 ml-16" />
            <h3 className="mt-4 font-medium text-text-black text-lg">Jodye</h3>
            <Badge className="mt-2 bg-[#c8f0dc] text-[#6dc06f] font-medium px-4 py-1 rounded-[5px]">
              Active
            </Badge>

            <div className="mt-12 w-10 h-10 bg-[#c8f0dc] rounded-[20px] flex items-center justify-center">
              <MessageCircleIcon className="w-5 h-4" />
            </div>

            <div className="mt-12 w-full">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-[#d9d9d9] rounded-[5px] flex items-center justify-center">
                  <FileIcon className="w-4 h-5" />
                </div>
                <span className="font-normal text-text-black text-[13px]">
                  Resume template.pdf
                </span>
                <span className="ml-auto font-normal text-text-black text-[13px]">
                  3.3 Mb
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// SearchIcon component since it's not imported from lucide-react
const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default PengaturanDengan;
