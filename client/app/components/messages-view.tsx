import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from "react-native";
import { API_URL, MessageScheme, useAuth, UserScheme, ChatScheme, API_URL_BASE } from "../api/AuthProvider";
import WebDateTimePicker from "./dateTimePicker";
import React from "react";
import * as ImagePicker from 'expo-image-picker';
import { GroupInfoModal } from '../components/modals/GroupInfoModal';
import * as DocumentPicker from 'expo-document-picker';
import UniversalDateTimePicker from '../components/WebCompatibleDateTimePicker';
import { Alert } from 'react-native';
import { DeleteChatModal } from "../components/modals/delete-modal";
import { useDrawerContext } from "./drawer/app-drawer-navigation";
import io from 'socket.io-client';
import mime from "mime";
import { ImagePreviewModal } from '../components/modals/ImagePreviewModal';
import { SimpleModal } from "./modals/simple-modal";


interface MessagesView {
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
  getModal,
  setModal,
  currentUserData,
}: MessagesView) {
  const { token, logout } = useAuth();
  const { loadedChat, setLoadedChat, setRefreshMessages, refreshMessages, setRefreshSidebar, refreshSidebar, base64ToBlob } = useDrawerContext();

  const [chatScrollView, setChatScrollView] = useState<ScrollView | null>(null);
  const [chatDetails, setChatDetails] = useState<ChatScheme | undefined>(undefined);
  const [messages, setMessages] = useState<MessageScheme[]>([]);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleTime, setScheduleTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // const socket = io(`${API_URL}`);
  //   React.useEffect(() => {
  //   console.log(currentUserData?.id);
  //   socket.emit('register', currentUserData?.id); // kirim userId setelah login

  //   socket.on('notification', (notif) => {
  //     console.log('Notifikasi baru:', notif);
  //     setRefreshMessages(!refreshMessages);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  React.useEffect(() => {
    if (!loadedChat) return;
    setMessages([]); // Clear previous messages
    handleLoadChatMessages();
    handleGetChatDetails();
  }, [loadedChat, refreshMessages]);

  // Scroll to the end of the chat messages when new messages are added
  React.useEffect(() => {
    if (chatScrollView) {
      chatScrollView.scrollToEnd({ animated: true });
    }
  }, [messages.length, refreshMessages]);

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
    if (!message.trim() && !selectedMedia) return;

    const formData = new FormData();
    formData.append("chatId", loadedChat);
    formData.append("content", message.trim());

    if (selectedMedia) {
      const uriParts = selectedMedia.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append("type", fileType === 'jpg' || fileType === 'png' ? 'image' : 'file');

      // Untuk web dan mobile berbeda
      if (Platform.OS === 'web') {
        const response = await fetch(selectedMedia);
        const blob = await response.blob();
        formData.append('media', blob, `media.${fileType}`);
      } else {
        formData.append('media', {
          uri: selectedMedia,
          name: `media.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }
    } else {
      formData.append("type", "text");
    }

    try {
      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();

      if (response.ok) {
        setMessage('');
        setSelectedMedia(null);
        handleLoadChatMessages(); // Muat ulang pesan
      } else {
        setModal({ ...getModal, visible: true, isLoading: false, message: responseJson.message || 'Failed to send media.' });
      }
    } catch (error) {
      console.error("Send error:", error);
      setModal({ ...getModal, visible: true, isLoading: false, message: 'Failed to send media.' });
    }
  };

  // handle delete message
  const handleDeleteChatRoom = async () => {
    setShowDeleteModal(false);
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 7000);
      });

      const response = await Promise.race(
        [
          fetch(`${API_URL}/chat/${loadedChat}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          })
        , timeoutPromise]
      );

      if (response instanceof Response) {
        if (response.ok) {
          setRefreshMessages(!refreshMessages);
          setRefreshSidebar(!refreshSidebar); 
          setLoadedChat(""); // Kembali ke daftar chat
        } else if (response.status === 401) {
          logout(); // Token tidak valid
        } else {
          const responseJson = await response.json();
          setModal({
            ...getModal,
            visible: true,
            isLoading: false,
            message: responseJson.message || 'An error occurred while deleting the chat room.',
          });
        }
      } else {
        setModal({...getModal, visible: true, isLoading: false, message: 'An error occurred, invalid server response.'});
      }
    } catch (error) {
      console.error('Error deleting chat room:', error);
      setModal({
        ...getModal,
        visible: true,
        isLoading: false,
        message: 'Failed to delete chat room.',
      });
    }
  };

  // Handle scheduling a message
  const handleScheduleMessage = (time: Date) => {
    if (!message.trim()) return;
    const delay = time.getTime() - new Date().getTime();
    if (delay <= 0) {
      alert("Scheduled time must be in the future.");
      return;
    }

    const scheduledMessage = message.trim();

    // Kosongkan input & reset state
    setMessage("");
    setIsScheduling(false);

    setModal({
      ...getModal,
      visible: true,
      isLoading: false,
      message: `Message will be sent at ${time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} on ${time.toLocaleDateString()}`,
    });

    setTimeout(() => {
      // sendScheduledMessage(scheduledMessage);
    }, delay);
  };


  // handlePickImage
  const handlePickImage = async () => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setModal({
          visible: true,
          isLoading: false,
          message: 'Please allow access to storage to select images.',
        });
        return;
      }
    })();

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const image = result.assets[0].uri;
        await handleSendMedia(image, 'image');
      }
    } catch (error) {
      setModal({
        visible: true,
        isLoading: false,
        message: 'Please allow access to storage to select images.',
      });
      console.error("Image pick error:", error);
    }
  };

  // handlePickFile
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if ((result.output?.length || 0) > 0 && result.assets && result.assets.length > 0) {
        await handleSendMedia(result.assets[0].uri, 'file');
      }
    } catch (error) {
      console.error("File pick error:", error);
    }
  };

  //handle promote admin & remove member
  const handlePromoteToAdmin = async (user: UserScheme) => {
    try {
      const response = await fetch(`${API_URL}/chat/${loadedChat}/promote-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        console.log('User promoted to admin');
      } else {
        alert('Failed to promote user to admin');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('An error occurred while promoting user');
    }
  };

const handleDemoteFromAdmin = async (user: UserScheme) => {
  try {
    const response = await fetch(`${API_URL}/chat/${loadedChat}/demote-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (response.ok) {
      console.log('User demoted from admin');
    } else {
      alert('Failed to demote user');
    }
  } catch (error) {
    console.error('Demote error:', error);
    alert('An error occurred');
  }
};

const handleRemoveMember = async (user: UserScheme) => {
  try {
    const response = await fetch(`${API_URL}/chat/${loadedChat}/remove-member`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (response.ok) {
      console.log('User removed');
    } else {
      alert('Failed to remove member');
    }
  } catch (error) {
    console.error('Remove error:', error);
    alert('An error occurred');
  }
};

  // handleSendMedia
  const handleSendMedia = async (uri: string, type: string) => {
    try {
      setModal({ ...getModal, isLoading: true, visible: true });

      const formData = new FormData();
      formData.append('chatId', loadedChat);
      formData.append('type', type);
      
      if (uri.startsWith("data:image")) {
        const blob = base64ToBlob(uri);
        const file = new File([blob], "photo." + blob.type.split("/")[1], { type: blob.type });
        formData.append("media", file);
      } else {
        const imageName = uri ? uri.split('/').pop() : 'photo.jpg';
        const mimeType = mime.getType(uri);
        formData.append("media", {
          uri,
          name: imageName,
          type: mimeType || 'image/jpeg',
        } as any);
      }

      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (response.ok) {
        handleLoadChatMessages();
        setModal({
          ...getModal,
          isLoading: false,
          visible: false,
        })
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
      const otherUser = chatDetails?.participants.find(A => A.id !== currentUserData?.id);
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
            {(() => {
              let image = "";
              if(chatDetails?.isGroup) {
                image = `${chatDetails?.groupPhoto}` || '';
              } else {
                const otherUser = chatDetails?.participants.find(A => A.id !== currentUserData?.id);
                image = otherUser?.profilePhoto || '';
              }
              return (
                <Image
                source={{ uri: `${API_URL_BASE}/${image}`.replace(/\\/g, "/") }}
                style={styles.chatAvatar}
                />
              );
            })()}
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              if (chatDetails?.isGroup) {
                setShowGroupInfo(true);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.chatName}>{getChatName()}</Text>
          </TouchableOpacity>
          <Text style={styles.status}>Active</Text>
        </View>
        <View style={styles.chatHeaderActions}>
          <Ionicons name="notifications-outline" size={20} />
          <TouchableOpacity
            onPress={() => setShowDeleteModal(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.chatMessages}
        ref={ref => {
          setChatScrollView(ref);
        }}
      >
        <View style={styles.chatMessagesContainer}>
          {messages.map(msg => {
            const isMyMessage = msg.sender.id === currentUserData?.id;
            return (
              <View
                key={msg.id}
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
                {msg.type === 'text' && (
              <Text style={styles.messageText}>{msg.content}</Text>
            )}

            
            {msg.type === 'image' && (
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(msg.content);
                setShowImagePreview(true);
              }}
            >
              <Image
                source={{ uri: `${API_URL_BASE}/${msg.media}`.replace(/\\/g, "/")  }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 8,
                  marginVertical: 4,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}

            {msg.type === 'file' && (
              <View style={{
                padding: 10,
                backgroundColor: '#f1f5f9',
                borderRadius: 8,
                marginTop: 4,
                maxWidth: '100%',
              }}>
                <Text numberOfLines={1} style={{ color: '#1e40af' }}>
                  📄 {msg.media?.split('/').pop() || 'File'}
                </Text>
              </View>
            )}
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
        </View>
      </ScrollView>

      {/* Date and Time Picker */}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
       {showDatePicker && (
          <UniversalDateTimePicker
            value={scheduleTime || new Date()}
            mode="datetime"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false); // Tutup picker setelah pilih waktu
              if (selectedDate) {
                setScheduleTime(selectedDate);
                const timeString = selectedDate.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit"
                });
                const dateString = selectedDate.toLocaleDateString();
                setModal({
                  ...getModal,
                  visible: true,
                  isLoading: false,
                  message: `Message will be sent at ${timeString} on ${dateString}`,
                });
                handleScheduleMessage(selectedDate);
              }
            }}
          />
        )}
      </View>

      <View style={styles.inputBar}>
        <TouchableOpacity onPress={handlePickImage} style={styles.mediaButton}>
          <Ionicons name="image" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickFile} style={styles.mediaButton}>
          <Ionicons name="attach" size={24} color="#4f46e5" />
        </TouchableOpacity>
        {scheduleTime && (
        <View style={styles.scheduledBanner}>
          <Ionicons name="time-outline" size={16} color="#ef4444" />
          <Text style={styles.scheduledText}>
            Scheduled for {scheduleTime.toLocaleString()}
          </Text>
          <TouchableOpacity onPress={() => setScheduleTime(null)}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      )}

        {/* Input Field */}
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
          {/* Tombol Schedule / Cancel Schedule */}
          {scheduleTime ? (
            <TouchableOpacity
              onPress={() => setScheduleTime(null)}
              style={[styles.mediaButton, { backgroundColor: "#fee2e2", padding: 8, borderRadius: 8, marginRight: 4 }]}
            >
              <Ionicons name="close-circle" size={20} color="#b91c1c" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.mediaButton, { backgroundColor: "#e0e7ff", padding: 8, borderRadius: 8, marginRight: 4 }]}
            >
              <Ionicons name="time-outline" size={20} color="#1e3a8a" />
            </TouchableOpacity>
          )}

          {/* Tombol Send biasa */}
          <TouchableOpacity
            onPress={handleSend}
            style={styles.sendButton}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
      </View>
      <DeleteChatModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteChatRoom}
      />
      
      <ImagePreviewModal
        visible={showImagePreview}
        imageUrl={selectedImage}
        onClose={() => setShowImagePreview(false)}
      />             

      {chatDetails && (
        <GroupInfoModal
          getModal={getModal}
          setModal={setModal}
          visibility={showGroupInfo}
          groupData={chatDetails}
          currentUser={currentUserData}
          onPromoteToAdmin={handlePromoteToAdmin}
          onDemoteFromAdmin={handleDemoteFromAdmin}
          onRemoveMember={handleRemoveMember}
          onClose={() => setShowGroupInfo(false)}
        />
      )}
        
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
  chatMessagesContainer: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 700,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#dbeafe',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
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
  scheduledBanner: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fef2f2',
  padding: 8,
  borderRadius: 8,
  marginHorizontal: 16,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: '#f87171',
},
scheduledText: {
  flex: 1,
  marginLeft: 8,
  fontSize: 12,
  color: '#b91c1c',
},
  mediaButton: {
    marginHorizontal: 4,
  },
addButtonText: {
  marginLeft: 8,
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
adminBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#d1fae5',
  borderRadius: 6,
  paddingHorizontal: 6,
  paddingVertical: 2,
  marginLeft: 8,
},
adminLabel: {
  fontSize: 12,
  color: '#065f46',
  marginLeft: 4,
  fontWeight: '600',
},
});
function setSelectedMedia(arg0: null) {
  throw new Error("Function not implemented.");
}

