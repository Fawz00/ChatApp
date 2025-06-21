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
  Image,
  SafeAreaView,
} from "react-native";
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { API_URL, ChatScheme, MessageScheme, useAuth, UserScheme } from "../api/AuthProvider";
import { SimpleModal } from "../components/modals/simple-modal";
import ChatListSidebar from "../components/chatlist-sidebar";
import MessagesView from "../components/messages-view";   
import DateTimePicker from '@react-native-community/datetimepicker';


type RootDrawerParamList = {
  App: undefined;
};

type AppStackParamList = {
  Chats: undefined;
};

export type Props = CompositeScreenProps<
  NativeStackScreenProps<AppStackParamList, 'Chats'>,
  DrawerScreenProps<RootDrawerParamList, 'App'>
>;

const isWeb = Platform.OS === "web";

export default function ChatScreen(screenProps: Props) {
  const [getModal, setModal] = useState({
    message: '',
    isLoading: false,
    visible: false,
  });
  
  const { token, validate, logout } = useAuth();
  const [currentUserData, setCurrentUserData] = useState<UserScheme | undefined>(undefined);
  const [groupList, setGroupList] = useState<ChatScheme[]>([]);
  const [privateChatList, setPrivateChatList] = useState<ChatScheme[]>([]);
  const [loadedChat, setLoadedChat] = useState('');
  const [isSettingsVisible, setSettingsVisible] = useState(false);



  let screenWidth = Dimensions.get("window").width;
  const window = useWindowDimensions();
  const isLargeScreen = screenWidth > 720;

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

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
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
      
      {(loadedChat === '' || isLargeScreen) && (
        <ChatListSidebar
          screenProps={screenProps}
          groupList={groupList}
          privateChatList={privateChatList}
          currentUserData={currentUserData}
          loadedChat={loadedChat}
          setLoadedChat={setLoadedChat}
        />
      )}

      {/* Message view */}
      {loadedChat !== '' && (
        <MessagesView
          loadedChat={loadedChat}
          setLoadedChat={setLoadedChat}
          getModal={getModal}
          setModal={setModal}
          currentUserData={currentUserData}
        />
      )}

      {(loadedChat === '' && isLargeScreen) && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}>
            
          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Image
              alt=""
              style={styles.logoImage}
              source={require('../../assets/images/logo_hd.png')}
            />
            <Text style={styles.heading}>
              <Text style={styles.textBlue}>Hey </Text>
              <Text style={styles.textPink}>There!</Text>
            </Text>
            <Text style={styles.subheading}>welcome back</Text>
          </View>
        </View>
      )}

    </View>
    </SafeAreaView>
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

  welcomeSection: {
    marginVertical: 24,
    alignItems: "center",
  },
  logoImage: {
    marginTop: 24,
    alignSelf: 'center',
    width: 1080/4,
    height: 480/4,
    marginBottom: 20,
  },
  heading: {
    fontSize: 52,
    fontWeight: 400,
  },
  textBlue: {
    color: "#1e3a8a",
  },
  textPink: {
    color: "#ec4899",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginTop: 8,
  },
});
