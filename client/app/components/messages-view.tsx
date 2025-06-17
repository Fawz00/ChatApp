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
import { API_URL, MessageScheme, useAuth, UserScheme, ChatScheme } from "../api/AuthProvider";
import React from "react";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface MessagesView {
  loadedChat: string;
  setLoadedChat: (chatId: string) => void;
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
  setLoadedChat,
  getModal,
  setModal,
  currentUserData,
}: MessagesView) {
  const { token, logout } = useAuth();
  const [chatScrollView, setChatScrollView] = useState<ScrollView | null>(null);
  const [chatDetails, setChatDetails] = useState<ChatScheme | undefined>(undefined);
  const [messages, setMessages] = useState<MessageScheme[]>([]);
  const [message, setMessage] = useState("");
  

  // On loaded chat change, fetch the messages for the selected chat
  React.useEffect(() => {
    if (!loadedChat) return;
    setMessages([]); // Clear previous messages
    handleLoadChatMessages();
    handleGetChatDetails();
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
        } else if (response.status === 401) {
          logout();
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

  // Fetch chat details for groups or private chats
  const handleGetChatDetails = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 7000);
      });

      const response = await Promise.race(
        [
          fetch(`${API_URL}/chat/${loadedChat}`, {
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
          setChatDetails(responseJson as ChatScheme);
        } else if (response.status === 401) {
          logout();
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
      } else if (response.status === 401) {
        logout();
      } else {
        setModal({...getModal, visible: true, isLoading: false, message: responseJson.message || 'An error occurred on the server.'});
      }
    } catch (error) {
      setModal({...getModal, visible: true, isLoading: false, message: `An error occurred, unable to connect the server.\n${error instanceof Error ? error.message : 'Unknown error'}`});
      console.error('An error occurred:', error);
    }
  };

  // handlePickImage
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const image = result.assets[0];
        await handleSendMedia(image.uri, image.mimeType || 'image/jpeg', 'image');
      }
    } catch (error) {
      console.error("Image pick error:", error);
    }
  };

  // handlePickFile
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.type === 'success') {
        await handleSendMedia(result.uri, result.mimeType || 'application/octet-stream', 'file');
      }
    } catch (error) {
      console.error("File pick error:", error);
    }
  };

  // handleSendMedia
  const handleSendMedia = async (uri: string, mimeType: string, type: "image" | "file") => {
    try {
      setModal({ ...getModal, isLoading: true });

      const fileName = uri.split('/').pop() || 'file';
      const fileExt = fileName.split('.').pop();

      const formData = new FormData();
      formData.append('chatId', loadedChat);
      formData.append('type', type);
      formData.append('file', {
        uri,
        name: fileName,
        type: mimeType,
      } as any);

      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (response.ok) {
        handleLoadChatMessages();
      } else if (response.status === 401) {
        logout();
      } else {
        setModal({
          ...getModal,
          visible: true,
          isLoading: false,
          message: responseJson.message || 'Upload failed',
        });
      }
    } catch (error) {
      console.error("Send media error:", error);
      setModal({
        ...getModal,
        visible: true,
        isLoading: false,
        message: `Failed to send media.\n${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const getChatName = () => {
    let chatName: string;
    if (chatDetails?.isGroup) {
      chatName = chatDetails?.name || "Unknown Groupp";
    } else {
      const otherUser = chatDetails?.participants.find(A => A._id !== currentUserData?._id);
      chatName = otherUser?.username || "Unknown User";
    }
    return chatName;
  }

  return (
    <View style={styles.chatWindow}>
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderActions}>
          <TouchableOpacity
            onPress={() => setLoadedChat("")}
          >
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          <View style={styles.chatAvatar} />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.chatName}>{getChatName()}</Text>
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
        {messages.map(msg => {
          console.log("Message:", msg);
          const isMyMessage = msg.sender._id === currentUserData?._id;
          return (
            <View
              key={msg._id}
              style={[
                styles.messageBubble,
                isMyMessage ? styles.myMessage : styles.otherMessage
              ]}
            >
              {!isMyMessage && (
                <Text style={styles.sendernameText}>
                  {msg.sender.username || msg.sender.email || "Unknown"}
                </Text>
              )}
              <Text style={styles.messageText}>{msg.content}</Text>
              <Text style={styles.messageTime}>
{new Date(msg.updatedAt).toLocaleTimeString([], {
  hour: "numeric",
  minute: "2-digit",
})}{" "}
{isMyMessage && (
  <Ionicons
    // name={
    //   msg.isRead
    //     ? "checkmark-done"
    //     : msg.isDelivered
    //     ? "checkmark"
    //     : "time-outline"
    // }
    name="checkmark-done"
    size={14}
    color={true ? "#4f46e5" : "#6b7280"}
  />
)}
</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputBar}>
        <TouchableOpacity onPress={handlePickImage} style={styles.mediaButton}>
          <Ionicons name="image" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickFile} style={styles.mediaButton}>
          <Ionicons name="attach" size={24} color="#4f46e5" />
        </TouchableOpacity>

        <TextInput
          style={[styles.inputField, { height: 48 }]}
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
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: 20,
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
  sendernameText: {
    fontSize: 14,
    fontWeight: 'bold',
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
  mediaButton: {
    marginHorizontal: 4,
  },
});
