import {
  LayoutDashboardIcon,
  MessageSquareIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export const ChatAplication = (): JSX.Element => {
  // Team data for mapping
  const teams = [
    { id: 1, name: "Google", color: "bg-[#8a91d7]", letter: "G" },
    { id: 2, name: "Slack", color: "bg-[#df36a1]", letter: "S" },
    { id: 3, name: "Upwork", color: "bg-[#101973]", letter: "U" },
    { id: 4, name: "Fiver", color: "bg-[#9c157f]", letter: "F" },
    { id: 5, name: "Amazon", color: "bg-[#1d5742]", letter: "A" },
  ];

  // Chat data for mapping
  const chats = [
    {
      id: 1,
      name: "Jodye",
      message: "Hey, how is going? Everything is fine?",
      time: "18.27",
      unread: 2,
    },
    {
      id: 2,
      name: "Felly",
      message: "Hey, how is going? Everything is fine?",
      time: "18.20",
      unread: 0,
    },
    {
      id: 3,
      name: "Becca",
      message: "Hey, how is going? Everything is fine?",
      time: "18.03",
      unread: 0,
    },
    {
      id: 4,
      name: "Horner",
      message: "Hey, how is going? Everything is fine?",
      time: "17.56",
      unread: 2,
    },
    {
      id: 5,
      name: "Bica",
      message: "Hey, how is going? Everything is fine?",
      time: "17.01",
      unread: 0,
    },
  ];

  return (
    <div
      className="flex h-[1024px] items-center relative bg-white overflow-hidden w-full min-w-[1440px]"
      data-model-id="34:341"
    >
      <img
        className="relative w-[100px] h-[100px] ml-[-533.00px]"
        alt="Ellipse"
        src="/img/ellipse-2.svg"
      />

      {/* Left sidebar navigation */}
      <div className="relative w-[103px] h-[1024px] bg-neutral-200">
        <div className="absolute w-[47px] h-[279px] top-72 left-7 shadow-[0px_4px_4px_#00000040]">
          <Button
            variant="ghost"
            className="absolute w-[45px] h-[45px] top-0 left-px p-0"
          >
            <LayoutDashboardIcon className="w-[45px] h-[45px]" />
          </Button>

          <Button
            variant="ghost"
            className="absolute w-[45px] h-[45px] top-[156px] left-0.5 p-0"
          >
            <MessageSquareIcon className="w-[45px] h-[45px]" />
          </Button>

          <Button
            variant="ghost"
            className="absolute w-[45px] h-[45px] top-[234px] left-0 p-0"
          >
            <SettingsIcon className="w-[45px] h-[45px]" />
          </Button>
        </div>

        <img
          className="absolute w-[45px] h-[45px] top-9 left-[29px]"
          alt="Vector"
          src="https://c.animaapp.com/3CC1Y0ZI/img/vector.svg"
        />

        <Button
          variant="ghost"
          className="absolute w-[45px] h-[45px] top-[365px] left-[34px] p-0"
        >
          <UsersIcon className="w-[45px] h-[45px]" />
        </Button>

        <Button
          variant="ghost"
          className="absolute w-[45px] h-[45px] top-[948px] left-7 p-0"
        >
          <UserIcon className="w-[45px] h-[45px]" />
        </Button>
      </div>

      {/* Chat sidebar */}
      <div className="absolute w-[426px] h-[1024px] top-0 left-[103px] bg-[#f4f4f4]">
        {/* Header */}
        <div className="absolute top-[45px] left-[32px] font-medium text-text-black text-lg">
          Chat
        </div>

      {/* UserIcon profile */}
      <div className="flex flex-col items-center absolute top-[100px] left-1/2 transform -translate-x-1/2">
        <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-[0px_4px_6px_#00000040]">
          <AvatarImage src="" alt="Jonathan" />
          <AvatarFallback className="relative">
            <img
              className="absolute w-[57px] h-16 top-[23px] left-[27px]"
              alt="Vector"
              src="https://c.animaapp.com/3CC1Y0ZI/img/vector-1.svg"
            />
            <div className="absolute w-[13px] h-[13px] bottom-1 right-1 bg-[#6abb82] rounded-full border border-solid border-white"></div>
          </AvatarFallback>
        </Avatar>
        <div className="mt-3 font-medium text-text-black text-lg">
          Jonathan
        </div>
        <Badge className="mt-2 bg-[#c8f0dc] text-[#6dc06f] font-medium rounded-[5px] px-4">
          Active
        </Badge>
      </div>

      {/* Teams section */}
      <div className="absolute top-[320px] left-[32px]">
        <div className="font-medium text-text-black text-lg mb-4">
          Teams
        </div>
        <div className="flex space-x-4">
          {teams.map((team) => (
            <div key={team.id} className="flex flex-col items-center">
              <Avatar
                className={`w-[60px] h-[60px] ${team.color} rounded-[30px]`}
              >
                <AvatarFallback className="text-[#cac7c7] text-[20px]">
                  {team.letter}
                </AvatarFallback>
              </Avatar>
              <span className="mt-2 font-medium text-text-gray text-xs">
                {team.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chats section */}
      <div className="absolute top-[480px] left-[32px] flex items-center justify-between w-[362px]">
        <h3 className="font-medium text-text-black text-lg">Chats</h3>
        <Button variant="ghost" size="icon" className="h-auto p-0">
          <PlusIcon className="w-[15px] h-[15px]" />
        </Button>
      </div>

      {/* Chat filters */}
      <Tabs
        defaultValue="all"
        className="absolute top-[520px] left-[32px] w-[100px]"
      >
        <TabsList className="bg-transparent p-0 h-auto">
          <TabsTrigger
            value="all"
            className="px-0 data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none text-[13px] font-normal h-auto"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="px-0 ml-4 data-[state=active]:bg-transparent data-[state=active]:text-main data-[state=active]:shadow-none text-text-gray text-[13px] font-normal h-auto"
          >
            New
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* SearchIcon bar */}
      <div className="absolute w-[362px] h-[41px] top-[560px] left-[32px]">
        <Card className="rounded-[10px] shadow-[0px_2px_9px_#c2c2c240] border-none">
          <CardContent className="p-0 flex items-center">
            <Input
              className="border-none h-[41px] pl-3 text-[13px] font-normal text-text-gray"
              placeholder="Search"
            />
            <SearchIcon className="w-[15px] h-[15px] mr-3 text-text-gray" />
          </CardContent>
        </Card>
      </div>

      {/* Chat list */}
      <div className="absolute w-[362px] h-[305px] top-[620px] left-[32px]">
          {chats.map((chat, index) => (
            <div key={chat.id} className="flex items-start mb-4 relative">
              <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc] rounded-[24.5px] relative">
                <AvatarFallback className="relative">
                  <img
                    className="absolute w-7 h-7 top-[11px] left-2.5"
                    alt="Vector"
                    src="https://c.animaapp.com/3CC1Y0ZI/img/vector-8.svg"
                  />
                  <div className="absolute w-1.5 h-1.5 bottom-1.5 right-1.5 bg-[#6abb82] rounded-[3px] border border-solid border-[#efecec]"></div>
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-1">
                <div className="font-medium text-text-black text-lg">
                  {chat.name}
                </div>
                <div className="font-normal text-text-gray text-[13px]">
                  {chat.message}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-normal text-text-gray text-[10px]">
                  {chat.time}
                </div>
                {chat.unread > 0 && (
                  <div className="w-[15px] h-[15px] bg-[#d9d9d9] rounded-[7.5px] flex items-center justify-center mt-1">
                    <span className="font-normal text-text-gray text-[10px]">
                      {chat.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="absolute w-[1325px] h-[1080px] -top-7 left-[50px]">
        <img
          className="absolute w-[1390px] h-[1024px] top-7 left-0 object-cover"
          alt="Desain tanpa judul"
          src="https://c.animaapp.com/3CC1Y0ZI/img/desain-tanpa-judul--1---1--1.png"
        />
      </div>
    </div>
  );
};
