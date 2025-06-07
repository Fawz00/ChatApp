import { createContext, useContext, useState, useEffect, SetStateAction } from 'react';
import { PropsWithChildren } from 'react';
import { Storage } from 'expo-storage'
import { Platform } from 'react-native';

//#region Constants
export const API_URL = 'http://192.168.245.8:5000/api';

interface AuthContextType {
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
}
interface StorageAccount {
    token: string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
//#endregion

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        loadAccount();
    }, []);

    const saveAccount = async (token: string) => {
        try{
            const account: StorageAccount = {
                token: token
            };

            if(Platform.OS === 'web') {
                // For web, use localStorage
                localStorage.setItem('account', JSON.stringify(account));
                return;
            } else {
                // For mobile, use Expo Storage
                await Storage.setItem({
                    key: 'account',
                    value: JSON.stringify(account)
                });
            }
        } catch(e) {
            console.error(e);
        }
    }
    const loadAccount = async () => {
        try{
            if(Platform.OS === 'web') {
                // For web, use localStorage
                const item = localStorage.getItem('account');
                const data = item ? JSON.parse(item) as StorageAccount : null;
                if(data) {
                    setToken(data.token);
                }
                return;
            } else {
                // For mobile, use Expo Storage
                const item = await Storage.getItem({ key: 'account' });
                const data = item ? JSON.parse(item) as StorageAccount : null;
                if(data) {
                    setToken(data.token);
                }
            }
        } catch(e) {
            console.error(e);
        }
    }

    const login = (newToken: string) => {
        saveAccount(newToken);
        setToken(newToken);
    };

    const logout = () => {
        saveAccount('');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
