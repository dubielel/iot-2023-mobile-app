import { Preferences } from '@capacitor/preferences';
import { User } from '@codetrix-studio/capacitor-google-auth';
import { ReactNode, createContext, useContext, useState } from 'react';

export type UserContext = {
  user?: User;
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
  getUserFromPreferences: () => Promise<User | undefined>;
  setUserToPreferences: (user: User | undefined) => Promise<void>;
  removeUserFromPreferences: () => Promise<void>;
};

const getUserFromPreferences = async (): Promise<User | undefined> => {
  const { value } = await Preferences.get({ key: 'user' });
  return value ? (JSON.parse(value) as User) : undefined;
};

const setUserToPreferences = async (user: User | undefined): Promise<void> => {
  if (!user) return;
  await Preferences.set({
    key: 'user',
    value: JSON.stringify(user),
  });
};

const removeUserFromPreferences = async (): Promise<void> => {
  await Preferences.remove({ key: 'user' });
};

export const UserContext = createContext<UserContext | undefined>({
  getUserFromPreferences,
  setUserToPreferences,
  removeUserFromPreferences,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getUserFromPreferences,
        setUserToPreferences,
        removeUserFromPreferences,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
export const useUserProvider = () =>
  useContext<UserContext | undefined>(UserContext)!; // TODO force unwrap here needed????
