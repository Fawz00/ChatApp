import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Send,
  Settings,
  User,
} from "lucide-react";
import React from "react";

const PengaturanAccount = (): JSX.Element => {
  // Teams data
  const teams = [
    { id: 1, name: "Google", color: "#8a91d7", initial: "G" },
    { id: 2, name: "Slack", color: "#df36a1", initial: "S" },
    { id: 3, name: "Upwork", color: "#101973", initial: "U" },
    { id: 4, name: "Fiver", color: "#9c157f", initial: "F" },
    { id: 5, name: "Amazon", color: "#1d5742", initial: "A" },
  ];

  // Chat contacts data
  const contacts = [
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
    },
    {
      id: 3,
      name: "Becca",
      message: "Hey, how is going? Everything is fine?",
      time: "18.03",
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
    <div className="bg-white flex flex-row justify-center w-full h-screen">
      <div className="bg-white overflow-hidden w-[1440px] h-[1024px] relative">
        {/* Left sidebar with icons */}
        <div className="absolute w-[103px] h-[1024px] top-0 left-0 bg-neutral-200 flex flex-col items-center">
          <div className="mt-10 mb-20">
            <Menu className="w-[45px] h-[45px]" />
          </div>

          <div className="flex flex-col gap-8">
            <Settings className="w-[45px] h-[45px]" />
            <MessageCircle className="w-[45px] h-[45px]" />
            <User className="w-[45px] h-[45px]" />
          </div>

          <div className="mt-auto mb-10">
            <Avatar className="w-[45px] h-[45px]">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Chat list panel */}
        <div className="absolute w-[426px] h-[1024px] top-0 left-[99px] bg-[#f4f4f4]">
          <div className="p-6">
            <h1 className="font-medium text-text-black text-5xl">Chat</h1>
          </div>

          {/* User profile */}
          <div className="flex flex-col items-center mt-8">
            <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-md">
              <AvatarFallback className="text-4xl">J</AvatarFallback>
            </Avatar>
            <div className="w-[13px] h-[13px] bg-[#6abb82] rounded-full absolute ml-16 mt-24 border border-solid border-[#efecec]"></div>

            <h2 className="font-medium text-text-black text-lg mt-4">
              Jonathan
            </h2>
            <Badge className="bg-[#c8f0dc] text-[#6dc06f] font-medium mt-1">
              Active
            </Badge>
          </div>

          {/* Teams section */}
          <div className="mt-12 px-4">
            <h2 className="font-medium text-text-black text-lg mb-4">Teams</h2>
            <div className="flex gap-2 mb-2">
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
                  <span className="font-medium text-text-gray text-lg mt-2">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chats section */}
          <div className="mt-12 px-4">
            <h2 className="font-medium text-text-black text-lg mb-2">Chats</h2>

            <div className="bg-white rounded-[10px] shadow-sm p-3 mb-4">
              <Input
                className="border-none text-text-gray text-[13px]"
                placeholder="Search"
              />
            </div>

            <Tabs defaultValue="all">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="font-normal text-main text-[13px] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 mr-4"
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

              <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3">
                      <Avatar className="w-[49px] h-[49px] bg-[#d7d7dc]">
                        <AvatarFallback>
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                        {/* Active indicator */}
                        <div className="w-1.5 h-1.5 bg-[#6abb82] rounded-[3px] absolute bottom-1 right-1 border border-solid border-[#efecec]"></div>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-medium text-text-black text-lg">
                          {contact.name}
                        </h3>
                        <p className="font-normal text-text-gray text-[13px]">
                          {contact.message}
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-normal text-text-gray text-[10px]">
                          {contact.time}
                        </span>
                        {contact.unread && (
                          <div className="w-[15px] h-[15px] bg-[#d9d9d9] rounded-full mt-1 flex items-center justify-center">
                            <span className="font-normal text-text-gray text-[10px]">
                              {contact.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new">
                <div className="text-center py-4 text-text-gray">
                  No new messages
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Account settings panel */}
          <div className="absolute bottom-0 left-[99px] w-[426px]">
            <Card className="rounded-none border-none shadow-none">
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <div className="flex items-center p-4 bg-[#f4f4f4]">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-main-transparant rounded-[10px] flex items-center justify-center">
                        <User className="w-[30px] h-[30px]" />
                      </div>
                      <span className="font-medium text-black text-xl">
                        Account
                      </span>
                    </div>
                    <div className="ml-4 w-4 h-4">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center p-4 bg-[#f4f4f4]">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center">
                        <MessageCircle className="w-[30px] h-[30px]" />
                      </div>
                      <span className="font-medium text-black text-xl">
                        Chat
                      </span>
                    </div>
                    <div className="ml-4 w-4 h-4">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account settings popup */}
            <div className="absolute w-[233px] h-[458px] bottom-[70px] left-[170px] rounded-[50px] overflow-hidden bg-main">
              <div className="p-5 text-white">
                <h2 className="font-medium text-[32px] mb-6">Account</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-xl mb-2">Privacy</h3>
                    <Select>
                      <SelectTrigger className="w-[129px] h-8 border border-white text-white bg-transparent">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="contacts">Contacts</SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-medium text-xl mb-2">Last seen</h3>
                    <Select>
                      <SelectTrigger className="w-[129px] h-8 border border-white text-white bg-transparent">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="contacts">Contacts</SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-medium text-xl mb-2">Profile photo</h3>
                    <Select>
                      <SelectTrigger className="w-[129px] h-8 border border-white text-white bg-transparent">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="contacts">Contacts</SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-medium text-xl mb-2">About me</h3>
                    <Select>
                      <SelectTrigger className="w-[129px] h-8 border border-white text-white bg-transparent">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="contacts">Contacts</SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="absolute w-[518px] h-[1024px] top-0 left-[522px] border-l border-r border-gray-200">
          {/* Chat header */}
          <div className="h-[99px] bg-[#efecec] flex items-center px-4">
            <Avatar className="w-[49px] h-[49px]">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>

            <div className="ml-3">
              <h2 className="font-medium text-text-black text-lg">Jodye</h2>
              <Badge className="bg-transparent text-[#6dc06f] font-medium text-[10px] p-0">
                Active
              </Badge>
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-[53px] h-[53px] rounded-[10px]"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-[53px] h-[53px] rounded-[10px]"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="p-4 h-[calc(100%-180px)] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-6 flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                {!message.isMe && (
                  <Avatar className="w-[49px] h-[49px] mr-2">
                    <AvatarFallback>J</AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col">
                  <span className="text-text-gray text-[13px] mb-1">
                    {message.time}
                  </span>
                  <div
                    className={`p-3 rounded-[10px] shadow-md max-w-[237px] ${message.isMe ? "bg-[#efecec] ml-auto" : "bg-[#efecec]"}`}
                  >
                    <p className="text-text-black text-[13px]">
                      {message.content}
                    </p>
                  </div>
                </div>

                {message.isMe && (
                  <Avatar className="w-[49px] h-[49px] ml-2">
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Typing indicator */}
          <div className="absolute bottom-[70px] left-[544px] flex items-center">
            <Avatar className="w-[49px] h-[49px]">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <span className="ml-4 text-text-black text-[13px]">
              Jodye is typing
            </span>
          </div>

          {/* Message input */}
          <div className="absolute bottom-4 left-[544px] right-4 flex items-center">
            <Input
              className="bg-[#efecec] rounded-[10px] h-11 pr-24"
              placeholder="Type here"
            />
            <div className="absolute right-2 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-auto">
                <Paperclip className="h-6 w-6" />
              </Button>
              <Button className="bg-main h-[23px] rounded-[5px] px-2 flex items-center gap-1">
                <span className="text-[#efecec] text-[13px] font-medium">
                  send
                </span>
                <Send className="h-4 w-4 text-[#efecec]" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right profile panel */}
        <div className="absolute w-[300px] h-[1024px] top-0 right-0 flex flex-col items-center pt-[138px]">
          <Avatar className="w-[110px] h-[110px] bg-[#d9d9d9] border-2 border-solid border-[#b4b4b4] shadow-md">
            <AvatarFallback className="text-4xl">J</AvatarFallback>
          </Avatar>
          <div className="w-[13px] h-[13px] bg-[#6abb82] rounded-full absolute ml-16 mt-[103px] border border-solid border-[#efecec]"></div>

          <h2 className="font-medium text-text-black text-lg mt-4">Jodye</h2>
          <Badge className="bg-[#c8f0dc] text-[#6dc06f] font-medium mt-1">
            Active
          </Badge>

          <Button className="mt-8 w-10 h-10 rounded-full bg-[#c8f0dc]">
            <Mail className="h-5 w-4 text-black" />
          </Button>

          <div className="mt-12 flex items-center">
            <div className="w-10 h-10 bg-[#d9d9d9] rounded-[5px] flex items-center justify-center mr-3">
              <svg
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0L0 4V10C0 15.55 3.84 20.74 8 22C12.16 20.74 16 15.55 16 10V4L8 0Z"
                  fill="#333"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-text-black text-[13px]">Resume template.pdf</p>
            </div>
            <span className="text-text-black text-[13px]">3.3 Mb</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaturanAccount;
