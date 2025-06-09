import { createContext, useContext, useState, useEffect, SetStateAction } from 'react';
import { PropsWithChildren } from 'react';
import { Storage } from 'expo-storage'
import { Platform } from 'react-native';

//#region Constants
export const API_URL = 'http://192.168.100.7:5000/api';

interface AuthContextType {
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
    validate: () => Promise<string | undefined>;
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

    const validate = async (): Promise<string | undefined> => {
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Request timed out'));
                }, 7000);
            });
    
            const response = await Promise.race(
            [
                fetch(`${API_URL}/user/me`, {
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
                return responseJson._id;
            } else {
                console.warn(responseJson.message || 'An error occurred on the server.');
            }
            } else {
                console.warn('An error occurred, invalid server response.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ token, validate, login, logout }}>
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
