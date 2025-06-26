import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Platform, Dimensions, useWindowDimensions } from 'react-native';
import { UserScheme, ChatScheme, API_URL_BASE } from '../api/AuthProvider'; // Pastikan path ini benar
import { Feather, Ionicons } from '@expo/vector-icons'; // Jika ada ikon tambahan yang ingin Anda gunakan
import { Props } from '../AppScreen/Chat';
import { useDrawerContext } from './drawer/app-drawer-navigation';

interface ChatListSidebar {
  screenProps: Props,
  currentUserData: UserScheme | undefined;
  groupList: ChatScheme[];
  privateChatList: ChatScheme[];
}
const isWeb = Platform.OS === "web";

export default function ChatListSidebar({
  screenProps,
  currentUserData,
  groupList,
  privateChatList,
}: ChatListSidebar) {
  const { loadedChat, setLoadedChat, setCreateChat } = useDrawerContext();
  const [search, setSearch] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const isLargeScreen = screenWidth > 720;
  const isSmallHeight = screenHeight <= 530;

  // Components

  const ChatItem = ({ chat, isActive, onPress }: {
    chat: ChatScheme,
    isActive: boolean,
    onPress: () => void
  }) => {
    const isGroup = chat.isGroup;
    const chatName = isGroup
      ? chat.name || "Unknown Group"
      : chat.participants.find(p => p.id !== currentUserData?.id)?.username || "Unknown User";
    const lastMessage = chat.lastMessage?.content || "No messages yet";
    const imageSource = chat.groupPhoto ? { uri: `${API_URL_BASE}/${chat.groupPhoto}`.replace(/\\/g, "/") } : null;

    return (
      <TouchableOpacity
        key={chat.id}
        style={[styles.chatItem, isActive && styles.activeChatItem]}
        onPress={onPress}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.chatAvatar} />
        ) : (
          <View style={styles.chatAvatar}>
            <Text style={styles.teamText}>{chatName.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.chatItemContent}>
          <Text style={styles.chatName}>{chatName}</Text>
          <Text style={styles.chatPreview} numberOfLines={1}>{lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // React Elements

  return (
    <View style={isLargeScreen ? styles.sidebar : styles.sidebarMobile}>
      {isWeb && (
        <style type="text/css">
          {`
        input:focus {
          outline: none !important;
        }
          `}
        </style>
      )}

      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          backgroundColor: '#f3f4f6',
          padding: 8,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5, // For Android shadow
        }}
        onPress={() => screenProps.navigation.openDrawer()}
      >
        <Ionicons name="menu" size={24} />
      </TouchableOpacity>

      {/* Profile Card */}
      {!isSmallHeight && (
        <View style={styles.profileCard}>
          { currentUserData?.profilePhoto ? (
            <Image source={{ uri: `${API_URL_BASE}/${currentUserData.profilePhoto}`.replace(/\\/g, "/") }}
              style={styles.avatarPlaceholder}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.teamText}>{currentUserData?.username?.charAt(0).toUpperCase() || ""}</Text>
            </View>
          )}
          <Text style={styles.username}>{currentUserData?.username || currentUserData?.email || "Me"}</Text>
          <Text style={styles.status}>{currentUserData?.description || ""}</Text>
        </View>
      )}

      {/* Chat menu */}
      <View style={styles.chatMenu}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          { isSmallHeight && (
            <View style={{padding:21, marginRight: 8}}/>
          )}
          <Text style={styles.chatTitle}>Chat</Text>
          <TouchableOpacity
            style={styles.addChatButton}
            onPress={() => setCreateChat(true)}
          >
            <Feather name="plus" size={16} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.inputWrapper}>
        <Feather name="search" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Search"
          style={styles.input}
          placeholderTextColor="#666"
          onChangeText={text => setSearch(text)}
        />
      </View>

      <View style={styles.line} />

      {/* Search Result Section */}
      { search && (
        <View style={styles.chatListContainer}>
          <Text style={styles.chatListHeader}>Search</Text>
          <ScrollView style={styles.chatListScrollView}>
            {[...groupList, ...privateChatList]
              .filter(chat => {
              // Determine chat name for both group and private chats
              let chatName: string | undefined;
              if ('isGroup' in chat && !chat.isGroup) {
                // Private chat
                chatName = chat.participants.find(p => p.id !== currentUserData?.id)?.username;
              } else {
                // Group chat
                chatName = chat.name;
              }
              return chatName?.toLowerCase().includes(search.toLowerCase());
              })
              .map((val) => {
              let chatName: string;
              let lastMessage: string = (val as any).lastMessage?.content || "No messages yet";
              let isGroup = 'isGroup' in val ? val.isGroup : true;
              if (isGroup) {
                chatName = val.name || "Unknown Group";
              } else {
                const otherUser = val.participants.find((A: any) => A.id !== currentUserData?.id);
                chatName = otherUser ? otherUser.username || "Unknown User" : "Unknown User";
              }
              return (
                <ChatItem
                  key={val.id}
                  chat={val}
                  isActive={loadedChat === val.id}
                  onPress={() => {
                    if (loadedChat !== val.id) {
                      setLoadedChat(val.id);
                    }
                  }}
                />
              );
            })}
          </ScrollView>
        </View>
      ) || (!isSmallHeight ? (
        <>
          {/* Teams Section */}
          <View>
            <Text style={styles.teamLabel}>Teams</Text>
            <ScrollView contentContainerStyle={styles.teamsRow}>
              {groupList.map((val) => (
                <TouchableOpacity
                  key={val.id}
                  style={[
                    styles.teamButton,
                    loadedChat === val.id && styles.activeChatItem // Highlight active chat
                  ]}
                  onPress={() => {
                    if (loadedChat !== val.id) {
                      setLoadedChat(val.id);
                    }
                  }}
                >
                  { val.groupPhoto ? (
                    <Image source={{ uri: `${API_URL_BASE}/${val.groupPhoto}`.replace(/\\/g, "/") }}
                      style={styles.teamCircle}
                    />
                  ) : (
                    <View style={styles.teamCircle}>
                      <Text style={styles.teamText}>{val.name?.charAt(0).toUpperCase() || ""}</Text>
                    </View>
                  )}
                  <Text style={styles.teamName}>{val.name || "Unknown Group"}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.line} />

          {/* Chats Section */}
          <View style={styles.chatListContainer}>
            <Text style={styles.chatListHeader}>Chats</Text>
            <ScrollView style={styles.chatListScrollView}>
              {privateChatList.map((val) => {
                let chatName: string;
                let lastMessage: string = val.lastMessage?.content || "No messages yet";

                if (val.isGroup) {
                  chatName = val.name || "Unknown Group";
                } else {
                  const otherUser = val.participants.find(A => A.id !== currentUserData?.id);
                  chatName = otherUser ? otherUser.username || "Unknown User" : "Unknown User";
                }
                return (
                  <ChatItem
                    key={val.id}
                    chat={val}
                    isActive={loadedChat === val.id}
                    onPress={() => {
                      if (loadedChat !== val.id) {
                        setLoadedChat(val.id);
                      }
                    }}
                  />
                );
              })}

            </ScrollView>
          </View>
        </>
      ):(
        <>
          <View style={styles.chatListContainer}>
            <Text style={styles.chatListHeader}>Chats & Teams</Text>
            <ScrollView style={styles.chatListScrollView}>
              {[...groupList, ...privateChatList].map((val) => {
                let chatName: string;
                let lastMessage: string = val.lastMessage?.content || "No messages yet";

                if (val.isGroup) {
                  chatName = val.name || "Unknown Group";
                } else {
                  const otherUser = val.participants.find(A => A.id !== currentUserData?.id);
                  chatName = otherUser ? otherUser.username || "Unknown User" : "Unknown User";
                }
                return (
                  <ChatItem
                    key={val.id}
                    chat={val}
                    isActive={loadedChat === val.id}
                    onPress={() => {
                      if (loadedChat !== val.id) {
                        setLoadedChat(val.id);
                      }
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
        </>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    maxWidth: 420,
    minWidth: 300,
    width: '40%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  sidebarMobile: {
    width: '100%',
    height: '100%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  chatTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#d1d5db',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    color: 'green',
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // Light gray background
  },
  teamLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamsRow: {
    flexDirection: 'row',
    overflow: 'scroll',
    gap: 4,
    paddingBottom: 8, // For horizontal scroll indicators
    backgroundColor: 'rgba(229, 231, 235, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  teamCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamButton: {
    padding: 6,
    alignItems: 'center',
    borderRadius: 8, // Added for highlighting
  },
  teamText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  teamName: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  chatListContainer: {
    flex: 1,
  },
  chatListHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatListScrollView: {
    flex: 1, // Ensure ScrollView takes available space
  },
  chatItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    borderRadius: 8, // Added for highlighting
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#cbd5e1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItemContent: {
    flex: 1, // Allows text to take available space
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  chatPreview: {
    fontSize: 13,
    color: '#6b7280',
  },
  activeChatItem: {
    backgroundColor: '#e0e7ff', // Warna latar belakang untuk item yang aktif
  },
  chatMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    padding: 8,
    marginLeft: 'auto',
  },
  line: {
    paddingTop: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
  },
});