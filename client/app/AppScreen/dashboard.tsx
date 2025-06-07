import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const isWeb = Platform.OS === "web";

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "hello Jonathan.", time: "15 May, 18:15", from: "Jodye" },
    { id: 2, text: "Hey, how is going? Everything is fine?", time: "15 May, 18:17", from: "Jodye" },
    { id: 3, text: "hello Jodye, I’m fine...", time: "15 May, 18:27", from: "Jonathan" }
  ]);

  let screenWidth = Dimensions.get("window").width;
  const window = useWindowDimensions();
  const isLargeScreen = screenWidth >= 768;

  React.useEffect(() => {
    screenWidth = window.width;
  }, [window.width, window.height]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      text: message,
      time: new Date().toLocaleTimeString(),
      from: "Jonathan",
    };
    setMessages([...messages, newMsg]);
    setMessage("");
  };

  return (
    <View style={[styles.container, !isLargeScreen && styles.containerMobile]}>
      {isLargeScreen && (
        <View style={styles.sidebar}>
          <Text style={styles.logo}>Chat</Text>
          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder} />
            <Text style={styles.username}>Jonathan</Text>
            <Text style={styles.status}>Active</Text>
          </View>

          <View style={styles.teamContainer}>
            <Text style={styles.teamLabel}>Teams</Text>
            <View style={styles.teamsRow}>
              {['G', 'S', 'U', 'F', 'A', 'A', 'R', 'D'].map((t, i) => (
                <TouchableOpacity key={i}>
                  <View style={styles.teamCircle}>
                    <Text style={styles.teamText}>{t}</Text>
                  </View>
                  <Text style={styles.teamName}>{`Team ${i + 1}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chatListContainer}>
            <Text style={styles.chatListHeader}>Chats</Text>
            <ScrollView>
              {["Jodye", "Felly", "Becca", "Horner", "Bica", "Anna", "Raden Mas Joko Suloyo", "Kawasaki", "Momoka Kawahana", "Kadev"].map((name, i) => (
                <TouchableOpacity key={i} style={styles.chatItem}>
                  <View style={styles.chatAvatar} />
                  <View>
                    <Text style={styles.chatName}>{name}</Text>
                    <Text style={styles.chatPreview}>Hey, how is going? Everything is fine?</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      <View style={styles.chatWindow}>
        <View style={styles.chatHeader}>
          <View style={styles.chatAvatar} />
          <View>
            <Text style={styles.chatName}>Jodye</Text>
            <Text style={styles.status}>Active</Text>
          </View>
          <View style={styles.chatHeaderActions}>
            <Ionicons name="notifications-outline" size={20} />
            <Ionicons name="ellipsis-horizontal" size={20} />
          </View>
        </View>

        <ScrollView style={styles.chatMessages}>
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[styles.messageBubble, msg.from === "Jonathan" ? styles.myMessage : styles.otherMessage]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.inputField}
            placeholder="Type here"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLargeScreen && (
        <View style={styles.detailPanel}>
          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder} />
            <Text style={styles.username}>Jodye</Text>
            <Text style={styles.status}>Active</Text>
          </View>

          <View style={styles.attachmentSection}>
            <Ionicons name="document-text-outline" size={24} />
            <Text style={styles.attachmentName}>Resume template.pdf</Text>
            <Text style={styles.attachmentSize}>3.3 Mb</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
  },
  containerMobile: {
    flexDirection: 'column',
  },
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
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  teamCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  teamText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  teamName: {
    fontSize: 12,
    color: '#6b7280',
  },
  chatListContainer: {
    flex: 1,
  },
  chatListHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chatItem: {
    padding: 6,
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#cbd5e1',
    marginRight: 8,
  },
  chatName: {
    fontWeight: 'bold',
  },
  chatPreview: {
    fontSize: 12,
    color: '#6b7280',
  },
  chatWindow: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: '#f9fafb',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 6,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
  },
  messageTime: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingTop: 8,
  },
  inputField: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailPanel: {
    width: 320,
    padding: 16,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderColor: '#e5e7eb',
  },
  attachmentSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  attachmentName: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  attachmentSize: {
    color: '#6b7280',
    fontSize: 12,
  },
});
