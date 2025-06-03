import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  File,
  FileText,
  Image,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Settings,
  User,
} from "lucide-react";
import React from "react";

export default function MenuChatAplication(): JSX.Element {
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
    <main className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] h-[1024px] relative">
        {/* Left sidebar navigation */}
        <nav className="absolute w-[103px] h-[1024px] top-0 left-0 bg-neutral-200">
          <div className="absolute w-[47px] h-[279px] top-72 left-7 flex flex-col gap-5">
            <Button
              variant="ghost"
              size="icon"
              className="w-[45px] h-[45px] p-0"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-[45px] h-[45px] p-0"
            >
              <File className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-[45px] h-[45px] p-0"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute w-[45px] h-[45px] top-9 left-[29px]">
            <Button variant="ghost" size="icon" className="w-full h-full p-0">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute w-[45px] h-[45px] top-[945px] left-[29px]">
            <Button variant="ghost" size="icon" className="w-full h-full p-0">
              <User className="w-6 h-6" />
            </Button>
          </div>
        </nav>

        <div className="absolute w-[944px] h-[1027px] top-[-3px] left-[103px]">
          {/* Chat list panel */}
          <div className="absolute w-[426px] h-[1024px] top-[3px] left-0 bg-[#f4f4f4]">
            {/* User profile */}
            <div className="absolute top-[25px] left-[13px] font-medium text-text-black text-5xl">
              Chat
            </div>

            <div className="absolute w-[110px] h-[110px] top-[141px] left-[143px] flex flex-col items-center">
              <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
                <AvatarImage src="" alt="Jonathan" />
                <AvatarFallback className="text-4xl">J</AvatarFallback>
              </Avatar>
              <div className="w-[13px] h-[13px] rounded-full bg-[#6abb82] absolute bottom-0 right-5 border border-solid border-white"></div>
            </div>

            <div className="absolute top-[263px] left-[156px] font-medium text-text-black text-lg">
              Jonathan
            </div>

            <Badge className="absolute w-[102px] h-[25px] top-[291px] left-[147px] bg-[#c8f0dc] text-[#6dc06f] font-medium text-[15px] flex items-center justify-center rounded-[5px] hover:bg-[#c8f0dc]">
              Active
            </Badge>

            {/* Teams section */}
            <div className="absolute top-[367px] left-3 font-medium text-text-black text-lg">
              Teams
            </div>

            <div className="absolute top-[404px] left-0.5 flex space-x-4">
              {teams.map((team) => (
                <div key={team.id} className="flex flex-col items-center">
                  <Avatar
                    className={`w-[70px] h-[70px] ${team.color} rounded-[35px]`}
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
            <div className="absolute top-[547px] left-2 font-medium text-text-black text-lg flex justify-between items-center w-[380px]">
              Chats
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="absolute w-[385px] h-[41px] top-[571px] left-1">
              <Input
                className="bg-white rounded-[10px] shadow-[0px_2px_9px_#c2c2c240] h-[41px]"
                placeholder="Search"
              />
              <Search className="absolute w-[15px] h-[15px] top-3 right-5 text-text-gray" />
            </div>

            <Tabs
              defaultValue="all"
              className="absolute top-[616px] left-2 w-[100px]"
            >
              <TabsList className="bg-transparent h-6 p-0 gap-4">
                <TabsTrigger
                  value="all"
                  className="px-0 data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none h-6 text-[13px]"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="px-0 data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none h-6 text-[13px] text-text-gray"
                >
                  New
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Chat list */}
            <div className="absolute w-[422px] h-[305px] top-[649px] left-[3px]">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-start mb-4 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc] rounded-[24.5px] relative">
                    <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    {chat.active && (
                      <div className="absolute w-1.5 h-1.5 bottom-1 right-1 bg-[#6abb82] rounded-[3px] border border-solid border-[#efecec]"></div>
                    )}
                  </Avatar>

                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-text-black text-lg">
                        {chat.name}
                      </span>
                      <span className="text-text-gray text-[10px]">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-text-gray text-[13px]">{chat.message}</p>
                  </div>

                  {chat.unread > 0 && (
                    <div className="w-[15px] h-[15px] bg-[#d9d9d9] rounded-[7.5px] flex items-center justify-center">
                      <span className="text-text-gray text-[10px]">
                        {chat.unread}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main chat area */}
          <div className="absolute w-[518px] h-[1024px] top-[3px] left-[426px] bg-white">
            {/* Chat header */}
            <div className="absolute w-[518px] h-[99px] top-0 left-0 bg-[#efecec] flex items-center px-4">
              <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc]">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>

              <div className="ml-4">
                <div className="font-medium text-text-black text-lg">Jodye</div>
                <Badge className="bg-transparent text-[#6dc06f] font-medium text-[10px] p-0 hover:bg-transparent">
                  Active
                </Badge>
              </div>

              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-[53px] h-[53px] rounded-[10px] bg-[#d9d9d9] border-none"
                >
                  <Bell className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-[53px] h-[53px] rounded-[10px] bg-[#d9d9d9] border-none"
                >
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="absolute top-[100px] left-0 w-full h-[800px] overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className="mb-6">
                  <div className="text-text-gray text-[13px] mb-1">
                    {message.time}
                  </div>

                  <div
                    className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!message.isMe && (
                      <Avatar className="w-[49px] h-[49px] mr-2">
                        <AvatarFallback>
                          {message.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[237px] p-3 rounded-[10px] shadow-[0px_4px_4px_#00000040] ${
                        message.isMe ? "bg-[#efecec] ml-auto" : "bg-[#efecec]"
                      }`}
                    >
                      <p className="text-text-black text-[13px]">
                        {message.content}
                      </p>
                    </div>

                    {message.isMe && (
                      <Avatar className="w-[49px] h-[49px] ml-2">
                        <AvatarFallback>J</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Typing indicator */}
            <div className="absolute bottom-[80px] left-[445px] flex items-center">
              <Avatar className="w-[49px] h-[49px]">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <span className="ml-4 text-text-black text-[13px]">
                Jodye is typing
              </span>
              <span className="ml-2 animate-pulse">...</span>
            </div>

            {/* Message input */}
            <div className="absolute w-[476px] h-11 bottom-[14px] left-[445px] flex items-center">
              <Input
                className="bg-[#efecec] rounded-[10px] h-11 pr-[100px]"
                placeholder="Type here"
              />

              <div className="absolute right-0 flex items-center gap-2 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[23px] w-[23px] bg-main-transparant rounded-[5px] p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Button className="h-[23px] bg-main rounded-[5px] text-[#efecec] text-[13px] px-2 flex items-center">
                  send
                  <Send className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Attachment popup */}
            <Card className="absolute w-[179px] h-[153px] bottom-[60px] right-[10px] bg-main text-white rounded-md">
              <CardContent className="p-4 flex flex-col gap-6">
                <div className="flex items-center gap-2 mt-4">
                  <Image className="h-5 w-5" />
                  <span className="text-base">Photo & videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-base">Document</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right sidebar - User profile */}
        <div className="absolute w-[393px] h-[1024px] top-0 right-0 bg-white">
          <div className="absolute w-[110px] h-[116px] top-[138px] left-[140px] flex flex-col items-center">
            <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
              <AvatarFallback className="text-4xl">J</AvatarFallback>
            </Avatar>
            <div className="w-[13px] h-[13px] rounded-full bg-[#6abb82] absolute bottom-0 right-5"></div>
          </div>

          <div className="absolute top-64 left-[173px] font-medium text-text-black text-lg">
            Jodye
          </div>

          <Badge className="absolute w-[102px] h-[25px] top-72 left-[144px] bg-[#c8f0dc] text-[#6dc06f] font-medium text-[15px] flex items-center justify-center rounded-[5px] hover:bg-[#c8f0dc]">
            Active
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="absolute w-10 h-10 top-[328px] left-[173px] bg-[#c8f0dc] rounded-[20px] p-0"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <div className="absolute top-[387px] left-[75px] flex items-center">
            <div className="w-10 h-10 bg-[#d9d9d9] rounded-[5px] flex items-center justify-center">
              <FileText className="h-5 w-4" />
            </div>
            <div className="ml-4">
              <p className="text-text-black text-[13px]">Resume template.pdf</p>
              <p className="text-text-black text-[13px] absolute top-[402px] left-[298px]">
                3.3 Mb
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
