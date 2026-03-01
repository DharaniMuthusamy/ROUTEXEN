import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getToken, setToken, removeToken, getMe,
    login as apiLogin, signup as apiSignup,
} from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hydrate user from stored token on mount
    useEffect(() => {
        async function hydrate() {
            const token = getToken();
            if (!token) { setLoading(false); return; }
            try {
                const userData = await getMe();
                setUser(userData);
            } catch {
                removeToken();
            } finally {
                setLoading(false);
            }
        }
        hydrate();
    }, []);

    const login = useCallback(async (email, password) => {
        const result = await apiLogin(email, password);
        setToken(result.access_token);
        const userData = await getMe();
        setUser(userData);
        return result;
    }, []);

    const signupUser = useCallback(async (name, email, password) => {
        const result = await apiSignup(name, email, password);
        setToken(result.access_token);
        const userData = await getMe();
        setUser(userData);
        return result;
    }, []);

    const logout = useCallback(() => {
        removeToken();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, signupUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
