import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { UserScheme, ChatScheme } from '../api/AuthProvider'; // Pastikan path ini benar
import { Ionicons } from '@expo/vector-icons'; // Jika ada ikon tambahan yang ingin Anda gunakan

interface ChatSidebarProps {
  currentUserData: UserScheme | undefined;
  groupList: ChatScheme[];
  privateChatList: ChatScheme[];
  loadedChat: string;
  setLoadedChat: (chatId: string) => void;
}

export default function ChatSidebar({
  currentUserData,
  groupList,
  privateChatList,
  loadedChat,
  setLoadedChat,
}: ChatSidebarProps) {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>Chat</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.username}>{currentUserData?.username || currentUserData?.email || "Me"}</Text>
        <Text style={styles.status}>{currentUserData?.description || ""}</Text>
      </View>

      {/* Teams Section */}
      <View style={styles.teamContainer}>
        <Text style={styles.teamLabel}>Teams</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamsRow}>
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
    width: 320,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
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
  teamContainer: {
    marginBottom: 24,
  },
  teamLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamsRow: {
    flexDirection: 'row',
    gap: 4,
    paddingBottom: 8, // For horizontal scroll indicators
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
});