import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { API_URL, MessageScheme, useAuth, UserScheme } from "../api/AuthProvider";
import React from "react";


interface MessagesView {
  loadedChat: string;
  getModal: {
    message: string;
    isLoading: boolean;
    visible: boolean;
  };
  setModal: (modal: {
    message: string;
    isLoading: boolean;
    visible: boolean;
  }) => void;
  currentUserData: UserScheme | undefined;
}

export default function MessagesView({
  loadedChat,
  getModal,
  setModal,
  currentUserData,
}: MessagesView) {
  const { token } = useAuth();
  const [chatScrollView, setChatScrollView] = useState<ScrollView | null>(null);
  const [messages, setMessages] = useState<MessageScheme[]>([]);
  const [message, setMessage] = useState("");

  // On loaded chat change, fetch the messages for the selected chat
  React.useEffect(() => {
    if (!loadedChat) return;
    setMessages([]); // Clear previous messages
    handleLoadChatMessages();
  }, [loadedChat]);

  // Scroll to the end of the chat messages when new messages are added
  React.useEffect(() => {
    if (chatScrollView) {
      chatScrollView.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  // ============================================
  // API Calls
  // ============================================

  // Handle load chat messages
  const handleLoadChatMessages = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 7000);
      });

      const response = await Promise.race(
        [
          fetch(`${API_URL}/chat/${loadedChat}/messages`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
        , timeoutPromise]
      );

      if (response instanceof Response) {
        const responseJson = await response.json();
        if (response.ok) {
          setMessages(responseJson.data as MessageScheme[]);
        } else {
          setModal({...getModal, visible: true, isLoading: false, message: responseJson.message || 'An error occurred on the server.'});
        }
      } else {
        setModal({...getModal, visible: true, isLoading: false, message: 'An error occurred, invalid server response.'});
      }
    } catch (error) {
      setModal({...getModal, visible: true, isLoading: false, message: `An error occurred, unable to connect the server.\n${error instanceof Error ? error.message : 'Unknown error'}`});
      console.error('An error occurred:', error);
    }
  }

  // Handle sending a message
  const handleSend = async () => {
    if (!message.trim()) return;
    if (!loadedChat || !token) return;

    setModal({ ...getModal, isLoading: true });

    try {
      const formData = new FormData();
      formData.append("chatId", loadedChat);
      formData.append("content", message.trim());
      formData.append("type", "text");

      const response = await fetch(`${API_URL}/chat/send`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (response.ok) {
        setMessage("");
        handleLoadChatMessages();
      } else {
        setModal({...getModal, visible: true, isLoading: false, message: 'An error occurred, invalid server response.'});
      }
    } catch (error) {
      setModal({...getModal, visible: true, isLoading: false, message: `An error occurred, unable to connect the server.\n${error instanceof Error ? error.message : 'Unknown error'}`});
      console.error('An error occurred:', error);
    }
  };

  return (
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

      <ScrollView
        style={styles.chatMessages}
        ref={ref => {
          setChatScrollView(ref);
        }}
      >
        {messages.map(msg => (
          <View
            key={msg._id}
            style={[styles.messageBubble, msg.sender._id === currentUserData?._id ? styles.myMessage : styles.otherMessage]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
            <Text style={styles.messageTime}>{new Date(msg.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={[styles.inputField, {height: 48}]}
          placeholder="Type here"
          value={message}
          multiline
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatWindow: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    backgroundColor: '#f3f3f3',
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
  status: {
    color: 'green',
    fontSize: 12,
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
});

function setModal(arg0: any) {
  throw new Error("Function not implemented.");
}
