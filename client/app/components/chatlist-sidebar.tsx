import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Dimensions, useWindowDimensions } from 'react-native';
import { UserScheme, ChatScheme } from '../api/AuthProvider'; // Pastikan path ini benar
import { Feather, Ionicons } from '@expo/vector-icons'; // Jika ada ikon tambahan yang ingin Anda gunakan
import { Props } from '../AppScreen/Chat';

interface ChatListSidebar {
  screenProps: Props,
  currentUserData: UserScheme | undefined;
  groupList: ChatScheme[];
  privateChatList: ChatScheme[];
  loadedChat: string;
  setLoadedChat: (chatId: string) => void;
}
const isWeb = Platform.OS === "web";

export default function ChatListSidebar({
  screenProps,
  currentUserData,
  groupList,
  privateChatList,
  loadedChat,
  setLoadedChat,
}: ChatListSidebar) {
  const [search, setSearch] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const isLargeScreen = screenWidth > 720;
  const isSmallHeight = screenHeight <= 530;

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
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.username}>{currentUserData?.username || currentUserData?.email || "Me"}</Text>
          <Text style={styles.status}>{currentUserData?.description || ""}</Text>
        </View>
      )}

      {/* Chat menu */}
      <View style={styles.chatMenu}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          { isSmallHeight && (
            <View style={{padding:21, marginRight: 8}}/>
          )}
          <Text style={styles.chatTitle}>Chat</Text>
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

      {/* Teams Section */}
      <View style={styles.teamContainer}>
        <Text style={styles.teamLabel}>Teams</Text>
        <ScrollView contentContainerStyle={styles.teamsRow}>
          {groupList.map((val) => (
            <TouchableOpacity
              key={val._id}
              style={[
                styles.teamButton,
                loadedChat === val._id && styles.activeChatItem // Highlight active chat
              ]}
              onPress={() => {
                if (loadedChat !== val._id) {
                  setLoadedChat(val._id);
                }
              }}
            >
              <View style={styles.teamCircle}>
                <Text style={styles.teamText}>{val.name?.charAt(0).toUpperCase() || "_"}</Text>
              </View>
              <Text style={styles.teamName}>{val.name || "Unknown Group"}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
              const otherUser = val.participants.find(A => A._id !== currentUserData?._id);
              chatName = otherUser ? otherUser.username || "Unknown User" : "Unknown User";
            }
            return (
              <TouchableOpacity
                key={val._id}
                style={[
                  styles.chatItem,
                  loadedChat === val._id && styles.activeChatItem // Highlight active chat
                ]}
                onPress={() => {
                  if (loadedChat !== val._id) {
                    setLoadedChat(val._id);
                  }
                }}
              >
                <View style={styles.chatAvatar} />
                <View style={styles.chatItemContent}>
                  <Text style={styles.chatName}>{chatName}</Text>
                  <Text style={styles.chatPreview} numberOfLines={1}>{lastMessage}</Text>
                </View>
                {/* Optional: Add time or unread count here if available in ChatScheme */}
                {/* <Text style={styles.chatTime}>16:27</Text> */}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
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
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    marginBottom: 24,
    paddingBottom: 6,
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
  teamContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
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
});