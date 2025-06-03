import { MessageSquare, Plus, Search, User } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ChatApplication(): JSX.Element {
  // Teams data
  const teams = [
    { id: 1, name: "Google", color: "bg-[#8a91d7]", letter: "G" },
    { id: 2, name: "Slack", color: "bg-[#df36a1]", letter: "S" },
    { id: 3, name: "Upwork", color: "bg-[#101973]", letter: "U" },
    { id: 4, name: "Fiver", color: "bg-[#9c157f]", letter: "F" },
    { id: 5, name: "Amazon", color: "bg-[#1d5742]", letter: "A" },
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

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] h-[1024px] relative">
        {/* Left sidebar navigation */}
        <div className="absolute w-[103px] h-[1024px] top-0 left-0">
          <div className="absolute w-[103px] h-full top-0 left-0 bg-neutral-200">
            <div className="flex flex-col items-center">
              {/* Chat icon */}
              <Button
                variant="ghost"
                size="icon"
                className="mt-[73px] h-[45px] w-[45px]"
              >
                <MessageSquare className="h-6 w-6" />
              </Button>

              {/* Navigation icons */}
              <div className="mt-[207px] flex flex-col gap-[78px] items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[45px] w-[45px]"
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[45px] w-[45px]"
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[45px] w-[45px]"
                >
                  <MessageSquare className="h-6 w-6" />
                </Button>
              </div>

              {/* Profile icon */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-[39px] left-7 h-[45px] w-[45px]"
              >
                <User className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="absolute w-[426px] h-[1024px] top-0 left-[103px] bg-[#f4f4f4]">
          {/* Chat header */}
          <div className="px-8 py-10">
            <h2 className="font-medium text-text-black text-lg">Chat</h2>
          </div>

          {/* User profile */}
          <div className="flex flex-col items-center">
            <Avatar className="w-[110px] h-[110px] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
              <AvatarImage src="" alt="Jonathan" />
              <AvatarFallback className="bg-[#d9d9d9] text-2xl">
                <User className="h-16 w-16 text-gray-500" />
              </AvatarFallback>
            </Avatar>

            {/* Active status indicator */}
            <div className="w-[13px] h-[13px] rounded-[6.5px] bg-[#6abb82] relative -mt-3 ml-[68px]" />

            <h3 className="mt-4 font-medium text-text-black text-lg">
              Jonathan
            </h3>

            <Badge className="mt-2 bg-[#c8f0dc] text-[#6dc06f] font-medium px-4 py-1 rounded-[5px]">
              Active
            </Badge>
          </div>

          {/* Teams section */}
          <div className="mt-12 px-3">
            <h3 className="font-medium text-text-black text-lg ml-4 mb-4">
              Teams
            </h3>

            <div className="flex justify-between px-2">
              {teams.map((team) => (
                <div key={team.id} className="flex flex-col items-center">
                  <Avatar className={`w-[70px] h-[70px] ${team.color}`}>
                    <AvatarFallback className="text-[#cac7c7] text-[25px]">
                      {team.letter}
                    </AvatarFallback>
                  </Avatar>
                  <span className="mt-2 font-medium text-text-gray text-lg">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chats section */}
          <div className="mt-8 px-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-text-black text-lg">Chats</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-2">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="px-0 mr-6 data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none text-[13px] h-auto"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="px-0 data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none text-text-gray text-[13px] h-auto"
                >
                  New
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search */}
            <div className="relative mb-4">
              <Input
                placeholder="Search"
                className="bg-white rounded-[10px] shadow-[0px_2px_9px_#c2c2c240] h-[41px] pl-3 text-[13px]"
              />
              <Search className="absolute right-3 top-3 h-[15px] w-[15px] text-gray-400" />
            </div>

            {/* Chat list */}
            <div className="space-y-4">
              {chats.map((chat) => (
                <Card
                  key={chat.id}
                  className="border-none shadow-none bg-transparent"
                >
                  <CardContent className="p-0 flex items-start">
                    <div className="relative">
                      <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc]">
                        <AvatarFallback>
                          <User className="h-7 w-7" />
                        </AvatarFallback>
                      </Avatar>
                      {chat.active && (
                        <div className="w-1.5 h-1.5 absolute bottom-1 right-1 bg-[#6abb82] rounded-[3px] border border-solid border-[#efecec]" />
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-text-black text-lg">
                          {chat.name}
                        </h4>
                        <span className="text-text-gray text-[10px]">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-text-gray text-[13px]">
                        {chat.message}
                      </p>
                    </div>

                    {chat.unread > 0 && (
                      <div className="bg-[#d9d9d9] rounded-[7.5px] w-[15px] h-[15px] flex items-center justify-center ml-2">
                        <span className="text-text-gray text-[10px]">
                          {chat.unread}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="absolute w-[911px] h-[1024px] top-0 left-[529px] flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src="" alt="Weitnah Logo" className="h-20" />
            </div>
            <h1 className="text-4xl font-bold text-gray-600 tracking-widest mb-2">
              W E I T N A H
            </h1>
            <p className="text-gray-500 uppercase text-sm tracking-wider">
              Senandung harmoni mendekatkan jarak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
