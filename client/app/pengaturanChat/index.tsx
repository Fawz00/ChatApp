import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Mail,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Send,
  Settings,
  User,
} from "lucide-react";
import React from "react";

// Define data for teams
const teams = [
  { id: 1, name: "Google", color: "#8a91d7", initial: "G" },
  { id: 2, name: "Slack", color: "#df36a1", initial: "S" },
  { id: 3, name: "Upwork", color: "#101973", initial: "U" },
  { id: 4, name: "Fiver", color: "#9c157f", initial: "F" },
  { id: 5, name: "Amazon", color: "#1d5742", initial: "A" },
];

// Define data for chats
const chats = [
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

// Define data for messages
const messages = [
  {
    id: 1,
    sender: "Jodye",
    message: "helloo Jonathan.",
    time: "15 May 2025, 18.15",
    isMe: false,
  },
  {
    id: 2,
    sender: "Jodye",
    message: "Hey, how is going?Everything is fine?",
    time: "15 May 2025, 18.17",
    isMe: false,
  },
  {
    id: 3,
    sender: "Jonathan",
    message: "helloo Jodye, i;m fine..",
    time: "15 May 2025, 18.27",
    isMe: true,
  },
];

// Define chat settings options
const chatSettings = [
  {
    id: 1,
    title: "Archive all chats",
    description: "Delete all messages and clear the chats form your history",
  },
  {
    id: 2,
    title: "Clear all messages",
    description: "Delete all messages from chats and groups",
  },
  {
    id: 3,
    title: "Delete all chats",
    description: "Delete all messages and clear the chats form your history",
  },
];

const PengaturanChat = (): JSX.Element => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] h-[1024px] relative">
        {/* Left sidebar navigation */}
        <div className="absolute w-[103px] h-[1024px] top-0 left-0 bg-neutral-200">
          <div className="absolute w-[47px] h-[279px] top-[291px] left-7">
            <Button
              variant="ghost"
              size="icon"
              className="absolute w-[45px] h-[45px] top-0 left-px"
            >
              <Settings className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute w-[45px] h-[45px] top-[156px] left-0.5"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute w-[45px] h-[45px] top-[234px] left-0"
            >
              <User className="h-6 w-6" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute w-[45px] h-[45px] top-[39px] left-[29px]"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Chat list section */}
        <div className="absolute w-[426px] h-[1024px] top-0 left-[103px] bg-[#f4f4f4]">
          <div className="absolute top-[25px] left-[16px] font-medium text-text-black text-5xl">
            Chat
          </div>

          {/* User profile */}
          <div className="absolute top-[141px] left-[143px] flex flex-col items-center">
            <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
              <AvatarImage src="" alt="Jonathan" />
              <AvatarFallback className="text-4xl">
                <User className="w-14 h-16" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute w-[13px] h-[13px] bottom-1 right-1 bg-[#6abb82] rounded-full"></div>

            <div className="mt-3 font-medium text-text-black text-lg">
              Jonathan
            </div>

            <Badge className="mt-1 bg-[#c8f0dc] text-[#6dc06f] font-medium rounded-[5px] px-4">
              Active
            </Badge>
          </div>

          {/* Teams section */}
          <div className="absolute top-[367px] left-[115px] font-medium text-text-black text-lg">
            Teams
          </div>

          <div className="absolute top-[404px] left-[105px] flex space-x-4">
            {teams.map((team) => (
              <div key={team.id} className="flex flex-col items-center">
                <Avatar
                  className="w-[70px] h-[70px]"
                  style={{ backgroundColor: team.color }}
                >
                  <AvatarFallback className="text-[25px] text-[#cac7c7]">
                    {team.initial}
                  </AvatarFallback>
                </Avatar>
                <span className="mt-2 font-medium text-text-gray text-lg">
                  {team.name}
                </span>
              </div>
            ))}
          </div>

          {/* Chats section */}
          <div className="absolute top-[547px] left-[111px] font-medium text-text-black text-lg">
            Chats
          </div>

          <div className="absolute top-[616px] left-[111px] flex space-x-8">
            <span className="font-normal text-main text-[13px]">All</span>
            <span className="font-normal text-text-gray text-[13px]">New</span>
          </div>

          <div className="absolute w-[385px] h-[41px] top-[571px] left-[107px]">
            <Input
              className="bg-white rounded-[10px] shadow-[0px_2px_9px_#c2c2c240] h-[41px]"
              placeholder="Search"
            />
          </div>

          {/* Chat list */}
          <div className="absolute w-[422px] h-[305px] top-[649px] left-[106px]">
            {chats.map((chat, index) => (
              <div key={chat.id} className="relative mb-4 flex items-start">
                <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc] rounded-[24.5px]">
                  <AvatarFallback>
                    <User className="w-7 h-7" />
                  </AvatarFallback>
                  {chat.active && (
                    <div className="absolute w-1.5 h-1.5 bottom-1 right-1 bg-[#6abb82] rounded-[3px] border border-solid border-[#efecec]"></div>
                  )}
                </Avatar>

                <div className="ml-3">
                  <div className="font-medium text-text-black text-lg">
                    {chat.name}
                  </div>
                  <div className="font-normal text-text-gray text-[13px]">
                    {chat.message}
                  </div>
                </div>

                <div className="ml-auto text-right">
                  <div className="font-normal text-text-gray text-[10px]">
                    {chat.time}
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-[15px] h-[15px] bg-[#d9d9d9] rounded-[7.5px] flex items-center justify-center mt-1 ml-auto">
                      <span className="font-normal text-text-gray text-[10px]">
                        {chat.unread}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Settings panel */}
          <Tabs
            defaultValue="account"
            className="absolute bottom-0 left-[101px] w-[431px]"
          >
            <TabsList className="flex bg-transparent">
              <TabsTrigger
                value="account"
                className="flex items-center space-x-2 px-4 py-2"
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <span className="font-medium text-black text-xl">Account</span>
              </TabsTrigger>
              <TabsTrigger
                value="chats"
                className="flex items-center space-x-2 px-4 py-2"
              >
                <div className="w-10 h-10 bg-main-transparant rounded-[10px] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="font-medium text-black text-xl">Chats</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              {/* Account settings content would go here */}
            </TabsContent>

            <TabsContent value="chats">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-[179px] top-[541px]"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[233px] rounded-[50px] bg-gradient-to-b from-purple-500 to-purple-700 border-none p-0"
                >
                  <div className="relative h-[457px] p-5">
                    <h2 className="text-white text-[32px] font-medium mb-8">
                      Chats
                    </h2>

                    {chatSettings.map((setting) => (
                      <div key={setting.id} className="mb-6">
                        <Button
                          variant="secondary"
                          className="w-[114px] h-12 bg-[#d3d3d3] rounded-[5px] opacity-50"
                        >
                          <span className="font-bold text-[#f40000] text-[10px] tracking-[0.70px]">
                            {setting.title}
                          </span>
                        </Button>
                        <p className="mt-2 opacity-60 text-white text-[10px] tracking-[0.50px] max-w-[180px]">
                          {setting.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat area */}
        <div className="absolute w-[518px] h-[1009px] top-0 left-[529px] border-l border-r border-gray-200">
          {/* Chat header */}
          <div className="absolute w-[518px] h-[99px] top-0 left-0 bg-[#efecec] flex items-center px-4">
            <Avatar className="w-[49px] h-[49px]">
              <AvatarFallback>
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>

            <div className="ml-3">
              <div className="font-medium text-text-black text-lg">Jodye</div>
              <div className="font-medium text-[#6dc06f] text-[10px]">
                Active
              </div>
            </div>

            <div className="ml-auto flex space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="absolute top-[100px] left-0 w-full h-[850px] overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-8 ${message.isMe ? "flex justify-end" : ""}`}
              >
                <div className="flex flex-col">
                  <span className="text-text-gray text-[13px] mb-1">
                    {message.time}
                  </span>

                  <div className="flex items-start">
                    {!message.isMe && (
                      <Avatar className="w-[49px] h-[49px] mr-3">
                        <AvatarFallback>
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`bg-[#efecec] rounded-[10px] shadow-[0px_4px_4px_#00000040] p-3 max-w-[237px] relative ${message.isMe ? "ml-auto" : ""}`}
                    >
                      <span className="text-text-black text-[13px]">
                        {message.message}
                      </span>

                      {/* Message triangle pointer */}
                      <div
                        className={`absolute top-4 ${message.isMe ? "right-[-10px]" : "left-[-10px]"} w-0 h-0 border-t-8 border-b-8 border-transparent ${message.isMe ? "border-l-8 border-l-[#efecec]" : "border-r-8 border-r-[#efecec]"}`}
                      ></div>
                    </div>

                    {message.isMe && (
                      <Avatar className="w-[49px] h-[49px] ml-3">
                        <AvatarFallback>
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Typing indicator */}
          <div className="absolute bottom-[70px] left-[20px] flex items-center">
            <Avatar className="w-[49px] h-[49px]">
              <AvatarFallback>
                <MoreHorizontal className="w-6 h-1" />
              </AvatarFallback>
            </Avatar>
            <span className="ml-4 text-text-black text-[13px]">
              Jodye is typing
            </span>
          </div>

          {/* Message input */}
          <div className="absolute bottom-[20px] left-[20px] w-[476px]">
            <div className="relative">
              <Input
                className="bg-[#efecec] rounded-[10px] h-11 pr-[100px]"
                placeholder="Type here"
              />
              <div className="absolute right-0 top-0 h-full flex items-center space-x-2 pr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  className="bg-main h-[23px] rounded-[5px] flex items-center space-x-1 px-2"
                >
                  <span className="text-[#efecec] text-[13px]">send</span>
                  <Send className="h-4 w-4 text-[#efecec]" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - User profile */}
        <div className="absolute w-[300px] h-full top-0 right-0 flex flex-col items-center pt-[138px]">
          <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
            <AvatarFallback>
              <User className="w-14 h-16" />
            </AvatarFallback>
          </Avatar>
          <div className="absolute w-[13px] h-[13px] top-[241px] left-[1256px] bg-[#6abb82] rounded-full"></div>

          <div className="mt-4 font-medium text-text-black text-lg">Jodye</div>

          <Badge className="mt-2 bg-[#c8f0dc] text-[#6dc06f] font-medium rounded-[5px] px-4">
            Active
          </Badge>

          <Button className="mt-8 w-10 h-10 bg-[#c8f0dc] rounded-[20px] p-0">
            <Mail className="h-5 w-5 text-[#6dc06f]" />
          </Button>

          <div className="mt-12 flex items-center">
            <div className="w-10 h-10 bg-[#d9d9d9] rounded-[5px] flex items-center justify-center mr-3">
              <User className="h-5 w-4" />
            </div>
            <div className="flex-1">
              <span className="text-text-black text-[13px]">
                Resume template.pdf
              </span>
            </div>
            <span className="text-text-black text-[13px] ml-4">3.3 Mb</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaturanChat;
