import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '../state/atoms';
import { pb } from '../pocketbase';
import { toast } from 'react-hot-toast';

interface RegisterData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  const login = async (email: string, password: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: '1',
          email,
          name: 'Test User',
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        return { token: 'mock_token', record: mockUser };
      }

      const authData = await pb.collection('users').authWithPassword(email, password);
      setUser(authData.record);
      setIsAuthenticated(true);
      return authData;
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Login attempted without proper collections. Using mock data.');
        return;
      }
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: '1',
          email: data.email,
          name: data.name,
        };
        return mockUser;
      }

      const record = await pb.collection('users').create({
        ...data,
        emailVisibility: true,
      });
      return record;
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Registration attempted without proper collections. Using mock data.');
        return;
      }
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return {
    user,
    loading: false,
    login,
    register,
    logout,
    isAuthenticated,
  };
}