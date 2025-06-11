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
  BackHandler,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { API_URL, ChatScheme, MessageScheme, SidebarContent, useAuth, UserScheme } from "../api/AuthProvider";
import { SimpleModal } from "../components/simple-modal";
import SettingsPanel from "../components/settings-panel";
import ChatSidebar from "../components/chat-sidebar";

const isWeb = Platform.OS === "web";

export default function ChatScreen() {
  const [getModal, setModal] = useState({
    message: '',
    isLoading: false,
    visible: false,
  });
  const { token, validate, sidebarContent, setSidebarContent } = useAuth();
  const [currentUserData, setCurrentUserData] = useState<UserScheme | undefined>(undefined);
  const [chatScrollView, setChatScrollView] = useState<ScrollView | null>(null);
  const [groupList, setGroupList] = useState<ChatScheme[]>([]);
  const [privateChatList, setPrivateChatList] = useState<ChatScheme[]>([]);
  const [loadedChat, setLoadedChat] = useState('');

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageScheme[]>([]);

  let screenWidth = Dimensions.get("window").width;
  const window = useWindowDimensions();
  const isLargeScreen = screenWidth >= 720;

  // On load, validate the token
  React.useEffect(() => {
    const validateToken = async () => {
      try {
        const profile = await validate();
        setCurrentUserData(profile);
      } catch (error) {
        console.error('Token validation failed:', error);
        setModal({
          message: `An error occurred, unable to connect the server.\n${error instanceof Error ? error.message : 'Unknown error'}`,
          isLoading: false,
          visible: true,
        });
      }
    };
    validateToken();

    // Handle back button press on Android
    const backAction = () => {
      if (sidebarContent === SidebarContent.SETTINGS) {
        setSidebarContent(SidebarContent.CHAT_LIST);
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove(); // Clean up the event listener
    };
  }, []);

  // On window resize, update the screen width
  React.useEffect(() => {
    screenWidth = window.width;
  }, [window.width, window.height]);

  // On chat list change, fetch the chat list
  React.useEffect(() => {
    handleGetChatList(true);
    handleGetChatList(false);
  }, [groupList.length, privateChatList.length]);

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


  // ====================================================
  // API zone
  // ====================================================
  // Fetch chat list for groups or private chats
  const handleGetChatList = async (isGroup: boolean) => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 7000);
      });

      const params = new URLSearchParams({
        isGroup: isGroup.toString(),
        sortBy: "updatedAt",
      });

      const response = await Promise.race(
        [
          fetch(`${API_URL}/chat/me/all?${params.toString()}`, {
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
          if(isGroup) {
            setGroupList(responseJson.data as ChatScheme[]);
          } else {
            setPrivateChatList(responseJson.data as ChatScheme[]);
          }
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
          // Jangan set 'Content-Type', biarkan FormData yang handle.
        },
        body: formData,
      });

      const responseJson = await response.json();

      if (response.ok) {
        // Setelah kirim sukses, ambil ulang pesan
        setMessage("");
        handleLoadChatMessages();
      } else {
        setModal({
          message: responseJson.message || "Gagal mengirim pesan.",
          isLoading: false,
          visible: true,
        });
      }
    } catch (error) {
      setModal({
        message: `Terjadi kesalahan saat mengirim pesan.\n${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false,
        visible: true,
      });
    } finally {
      setModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <View style={[styles.container, !isLargeScreen && styles.containerMobile]}>
      {isWeb && (
        <style type="text/css">
          {`
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            ::-webkit-scrollbar-thumb {
              background-color: rgba(100, 100, 100, 0.6);
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background-color: rgba(100, 100, 100, 0.8);
            }

            ::-webkit-scrollbar-track {
              background: transparent;
            }

          `}
        </style>
      )}

      {/* pengaturan */}
      {/* <SettingsPanel isVisible={showSettings} onClose={() => setShowSettings(false)} /> */}

      {/* Modal Popup for Error Messages */}
      <SimpleModal
        visible={getModal.visible}
        message={getModal.message}
        isLoading={getModal.isLoading}
        onClose={() => setModal({ ...getModal, visible: false })}
      />
      
      {isLargeScreen && (
        <ChatSidebar
          groupList={groupList}
          privateChatList={privateChatList}
          currentUserData={currentUserData}
          loadedChat={loadedChat}
          setLoadedChat={setLoadedChat}
        />
      )}

      {/* Message view */}
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

      {/* Details view */}
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
    gap: 4,
    justifyContent: 'center',
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
