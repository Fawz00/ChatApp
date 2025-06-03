import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Edit,
  FileText,
  LogOut,
  Mail,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Send,
  Settings,
  User,
} from "lucide-react";
import React from "react";

const Profile = (): JSX.Element => {
  // Navigation icons data
  const navIcons = [
    { icon: <MessageSquare className="w-6 h-6" />, active: true },
    { icon: <FileText className="w-6 h-6" /> },
    { icon: <Settings className="w-6 h-6" /> },
  ];

  // Teams data
  const teams = [
    { name: "Google", letter: "G", color: "bg-[#8a91d7]" },
    { name: "Slack", letter: "S", color: "bg-[#df36a1]" },
    { name: "Upwork", letter: "U", color: "bg-[#101973]" },
    { name: "Fiver", letter: "F", color: "bg-[#9c157f]" },
    { name: "Amazon", letter: "A", color: "bg-[#1d5742]" },
  ];

  // Chat contacts data
  const contacts = [
    {
      name: "Jodye",
      message: "Hey, how is going? Everything is fine?",
      time: "18.27",
      unread: 2,
      active: true,
    },
    {
      name: "Felly",
      message: "Hey, how is going? Everything is fine?",
      time: "18.20",
      unread: 0,
      active: true,
    },
    {
      name: "Becca",
      message: "Hey, how is going? Everything is fine?",
      time: "18.03",
      unread: 0,
      active: true,
    },
    {
      name: "Horner",
      message: "Hey, how is going? Everything is fine?",
      time: "17.56",
      unread: 2,
      active: true,
    },
    {
      name: "Bica",
      message: "Hey, how is going? Everything is fine?",
      time: "17.01",
      unread: 0,
      active: true,
    },
  ];

  // Chat messages data
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
        {/* Left sidebar with navigation icons */}
        <div className="absolute w-[103px] h-[1024px] top-0 left-0 bg-neutral-200">
          <div className="flex flex-col items-center">
            <MessageSquare className="w-[45px] h-[45px] mt-[39px] text-main" />

            <div className="mt-[207px] flex flex-col gap-[78px]">
              {navIcons.map((item, index) => (
                <div
                  key={index}
                  className={`w-[45px] h-[45px] flex items-center justify-center ${item.active ? "text-main" : "text-gray-500"}`}
                >
                  {item.icon}
                </div>
              ))}
            </div>

            <div className="absolute bottom-[19px] left-[19px] w-[45px] h-[45px] bg-main-transparant rounded-[10px] flex items-center justify-center">
              <LogOut className="w-[37px] h-[37px] text-main" />
            </div>
          </div>
        </div>

        {/* Chat list section */}
        <div className="absolute w-[426px] h-[1024px] top-0 left-[104px] bg-[#f4f4f4]">
          <div className="p-6">
            <h1 className="font-medium text-text-black text-5xl">Chat</h1>

            {/* User profile */}
            <div className="flex flex-col items-center mt-[80px]">
              <Avatar className="w-[110px] h-[110px] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
                <AvatarFallback className="bg-[#d9d9d9]">
                  <User className="w-[57px] h-16" />
                </AvatarFallback>
              </Avatar>
              <div className="w-[13px] h-[13px] rounded-[6.5px] bg-[#6abb82] relative -mt-3 ml-[68px]" />
              <h2 className="font-medium text-text-black text-lg mt-4">
                Jonathan
              </h2>
              <Badge className="bg-[#c8f0dc] text-[#6dc06f] font-medium mt-2 px-4 py-1 rounded-[5px]">
                Active
              </Badge>
            </div>

            {/* Teams section */}
            <div className="mt-[40px]">
              <h2 className="font-medium text-text-black text-lg">Teams</h2>
              <div className="flex gap-4 mt-4">
                {teams.map((team, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Avatar className={`w-[70px] h-[70px] ${team.color}`}>
                      <AvatarFallback
                        className={`${team.color} text-[#cac7c7] text-[25px]`}
                      >
                        {team.letter}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-text-gray text-lg mt-2">
                      {team.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chats section */}
            <div className="mt-[30px]">
              <h2 className="font-medium text-text-black text-lg">Chats</h2>

              <div className="mt-6">
                <Input
                  className="bg-white rounded-[10px] shadow-[0px_2px_9px_#c2c2c240] h-[41px]"
                  placeholder="Search"
                />
              </div>

              <Tabs defaultValue="all" className="mt-4">
                <TabsList className="bg-transparent p-0 h-auto">
                  <TabsTrigger
                    value="all"
                    className="font-normal text-main text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 mr-6"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="font-normal text-text-gray text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0"
                  >
                    New
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Chat contacts list */}
              <div className="mt-4 space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="flex items-start gap-3.5">
                    <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc]">
                      <AvatarFallback className="bg-[#d7d7dc]">
                        <User className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-text-black text-lg">
                          {contact.name}
                        </h3>
                        <span className="font-normal text-text-gray text-[10px]">
                          {contact.time}
                        </span>
                      </div>
                      <p className="font-normal text-text-gray text-[13px]">
                        {contact.message}
                      </p>
                    </div>
                    {contact.unread > 0 && (
                      <div className="w-[15px] h-[15px] bg-[#d9d9d9] rounded-[7.5px] flex items-center justify-center">
                        <span className="font-normal text-text-gray text-[10px]">
                          {contact.unread}
                        </span>
                      </div>
                    )}
                    {contact.active && (
                      <div className="w-1.5 h-1.5 rounded-[3px] bg-[#6abb82] border border-solid border-[#efecec] absolute ml-[34px] mt-[43px]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Profile card overlay */}
            <Card className="absolute w-[375px] h-[458px] top-[528px] left-[132px] rounded-[50px] bg-[#8a91d7] bg-opacity-50 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-[457px] p-4">
                  <div className="flex flex-col items-center mt-2">
                    <Avatar className="w-[110px] h-[110px] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040] bg-[#d9d9d9]">
                      <AvatarFallback className="bg-[#d9d9d9]">
                        <User className="w-[57px] h-16" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="relative">
                      <div className="w-[294px] h-9 bg-[#d9d9d94c] mx-auto" />
                      <div className="absolute top-1 left-0.5 font-medium text-black text-xl">
                        Your Name
                      </div>
                      <Edit className="absolute top-2 right-0 w-[30px] h-[25px]" />
                    </div>

                    <div className="relative">
                      <div className="w-[294px] h-9 bg-[#d9d9d94c] mx-auto" />
                      <div className="absolute top-1 left-0.5 font-medium text-black text-xl">
                        About
                      </div>
                      <Edit className="absolute top-2 right-0 w-[30px] h-[25px]" />
                    </div>

                    <div className="relative">
                      <div className="w-[294px] h-9 bg-[#d9d9d94c] mx-auto" />
                      <div className="absolute top-1 left-0.5 font-medium text-black text-xl">
                        Email
                      </div>
                      <Edit className="absolute top-2 right-0 w-[30px] h-[25px]" />
                    </div>
                  </div>

                  <div className="mt-16 flex flex-col items-center">
                    <Button className="bg-[#d3d3d3] rounded-[20px] h-auto py-2 px-6">
                      <span className="opacity-50 font-bold text-[#f40000] text-[15px] tracking-[1.05px]">
                        Log out
                      </span>
                    </Button>

                    <p className="w-[293px] opacity-60 font-black text-white text-[10px] tracking-[0.50px] mt-4">
                      Chat history on this computer will be cleared when you log
                      out
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main chat area */}
        <div className="absolute w-[518px] h-[1024px] top-0 left-[530px] bg-white">
          {/* Chat header */}
          <div className="w-full h-[99px] bg-[#efecec] flex items-center px-4">
            <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc]">
              <AvatarFallback className="bg-[#d7d7dc]">
                <User className="w-[23px] h-[26px]" />
              </AvatarFallback>
            </Avatar>

            <div className="ml-4">
              <h2 className="font-medium text-text-black text-lg">Jodye</h2>
              <Badge className="bg-transparent p-0 text-[#6dc06f] font-medium text-[10px]">
                Active
              </Badge>
            </div>

            <div className="ml-auto flex gap-4">
              <Button
                variant="outline"
                size="icon"
                className="w-[53px] h-[53px] rounded-[10px] bg-[#d9d9d9]"
              >
                <Bell className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-[53px] h-[53px] rounded-[10px] bg-[#d9d9d9]"
              >
                <MoreVertical className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="p-4 h-[calc(100%-180px)] overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-8">
                <div className="text-text-gray text-[13px] mb-2">
                  {message.time}
                </div>

                <div
                  className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                >
                  {!message.isMe && (
                    <Avatar className="w-[49px] h-[49px] mr-3 bg-[#d7d7dc]">
                      <AvatarFallback className="bg-[#d7d7dc]">
                        <User className="w-[23px] h-[26px]" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className="relative">
                    <div className="bg-[#efecec] rounded-[10px] p-4 shadow-[0px_4px_4px_#00000040] max-w-[237px]">
                      {message.content}
                    </div>

                    {/* Message triangle pointer */}
                    <div
                      className={`absolute ${message.isMe ? "right-[-15px] top-4" : "left-[-15px] top-4"}`}
                    >
                      <div
                        className={`w-0 h-0 border-t-[10px] border-b-[10px] border-solid ${
                          message.isMe
                            ? "border-r-0 border-l-[15px] border-l-[#efecec] border-t-transparent border-b-transparent"
                            : "border-l-0 border-r-[15px] border-r-[#efecec] border-t-transparent border-b-transparent"
                        }`}
                      />
                    </div>
                  </div>

                  {message.isMe && (
                    <Avatar className="w-[49px] h-[49px] ml-3 bg-[#d7d7dc]">
                      <AvatarFallback className="bg-[#d7d7dc]">
                        <User className="w-[23px] h-[26px]" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Typing indicator */}
          <div className="absolute bottom-[80px] left-[549px] flex items-center">
            <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc]">
              <AvatarFallback className="bg-[#d7d7dc]">
                <MoreVertical className="w-[18px] h-1" />
              </AvatarFallback>
            </Avatar>
            <span className="ml-4 text-text-black text-[13px]">
              Jodye is typing
            </span>
          </div>

          {/* Message input */}
          <div className="absolute bottom-4 left-[549px] right-4 flex items-center">
            <Input
              className="bg-[#efecec] rounded-[10px] h-11 pr-[100px]"
              placeholder="Type here"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-auto">
                <Paperclip className="w-6 h-6" />
              </Button>
              <Button className="bg-main rounded-[5px] h-[23px] px-2 flex items-center">
                <span className="text-[#efecec] text-[13px] mr-1">send</span>
                <Send className="w-[15px] h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right profile section */}
        <div className="absolute top-[138px] right-[142px] flex flex-col items-center">
          <Avatar className="w-[110px] h-[110px] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
            <AvatarFallback className="bg-[#d9d9d9]">
              <User className="w-[57px] h-16" />
            </AvatarFallback>
          </Avatar>
          <div className="w-[13px] h-[13px] rounded-[6.5px] bg-[#6abb82] relative -mt-3 ml-[68px]" />

          <h2 className="font-medium text-text-black text-lg mt-4">Jodye</h2>
          <Badge className="bg-[#c8f0dc] text-[#6dc06f] font-medium mt-2 px-4 py-1 rounded-[5px]">
            Active
          </Badge>

          <Button className="w-10 h-10 bg-[#c8f0dc] rounded-[20px] mt-8">
            <Mail className="w-5 h-4" />
          </Button>

          <div className="mt-12 flex items-center">
            <div className="w-10 h-10 bg-[#d9d9d9] rounded-[5px] flex items-center justify-center">
              <FileText className="w-4 h-5" />
            </div>
            <div className="ml-4">
              <span className="text-text-black text-[13px]">
                Resume template.pdf
              </span>
              <span className="absolute right-[94px] text-text-black text-[13px]">
                3.3 Mb
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
