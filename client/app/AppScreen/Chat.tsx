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
import { API_URL, ChatScheme, MessageScheme, useAuth, UserScheme } from "../api/AuthProvider";
import { SimpleModal } from "../components/simple-modal";

const isWeb = Platform.OS === "web";

export default function ChatScreen() {
  const [getModal, setModal] = useState({
    message: '',
    isLoading: false,
    visible: false,
  });
  const { token, validate } = useAuth();
  const [currentUserData, setCurrentUserData] = useState<UserScheme | undefined>(undefined);
  const [chatScrollView, setChatScrollView] = useState<ScrollView | null>(null);
  const [groupList, setGroupList] = useState<ChatScheme[]>([]);
  const [privateChatList, setPrivateChatList] = useState<ChatScheme[]>([]);
  const [loadedChat, setLoadedChat] = useState('');

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageScheme[]>([]);

  let screenWidth = Dimensions.get("window").width;
  const window = useWindowDimensions();
  const isLargeScreen = screenWidth >= 768;

  // On load, validate the token
  React.useEffect(() => {
    const validateToken = async () => {
      try {
        const userData = await validate();
        setCurrentUserData(userData);
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
  const handleSend = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      text: message,
      time: new Date().toLocaleTimeString(),
      from: "Jonathan",
    };
    // Handle POST request to send the message here
    // Not implemented yet.
    setMessage("");
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

      {/* Modal Popup for Error Messages */}
      <SimpleModal
        visible={getModal.visible}
        message={getModal.message}
        isLoading={getModal.isLoading}
        onClose={() => setModal({ ...getModal, visible: false })}
      />
      
      {isLargeScreen && (
        <View style={styles.sidebar}>
          <Text style={styles.logo}>Chat</Text>
          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder} />
            <Text style={styles.username}>{currentUserData?.username || currentUserData?.email || "Me"}</Text>
            <Text style={styles.status}>{currentUserData?.description || ""}</Text>
          </View>

          <View style={styles.teamContainer}>
            <Text style={styles.teamLabel}>Teams</Text>
            <View style={styles.teamsRow}>
              {groupList.map((val, i) => (
                <TouchableOpacity key={i} style={styles.teamButton}
                  onPress={() => {
                    if (loadedChat !== val._id) {
                      setLoadedChat(val._id);
                    }
                  }}
                >
                  <View style={styles.teamCircle}>
                    <Text style={styles.teamText}>{val.name?.charAt(0) || "_"}</Text>
                  </View>
                  <Text style={styles.teamName}>{val.name || "Unkown Group"}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.chatListContainer}>
            <Text style={styles.chatListHeader}>Chats</Text>
            <ScrollView>
              {privateChatList.map((val, i) => {
                let chatName: string;
                let lastMessage: string = val.lastMessage?.content || "No messages yet";
                if(val.isGroup) {
                  chatName = val.name || "Unknown Group";
                } else {
                  const otherUser = val.participants.filter(A => {return A._id !== currentUserData?._id});
                  chatName = otherUser[0] ? otherUser[0].username || "Unknown User" : "Unknown User";
                }
                return (
                  <TouchableOpacity key={i} style={styles.chatItem}
                    onPress={() => {
                      if (loadedChat !== val._id) {
                        setLoadedChat(val._id);
                      }
                    }}
                  >
                    <View style={styles.chatAvatar} />
                    <View>
                      <Text style={styles.chatName}>{chatName}</Text>
                      <Text style={styles.chatPreview}>{lastMessage}</Text>
                    </View>
                  </TouchableOpacity>
              );
              })}
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
