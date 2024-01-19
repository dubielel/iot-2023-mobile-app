import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { IonContent, IonSpinner } from '@ionic/react';
import { useState, useCallback, useEffect, CSSProperties } from 'react';
import { Redirect } from 'react-router';
import { useUserProvider } from './contexts/UserContext';
import { Spinner } from './components/Spinner';

export const LoadingScreen = () => {
  const user = useUserProvider();
  const [isLoaded, setLoaded] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const deviceReadyCallback = useCallback(() => {
    requestAnimationFrame(async () => {
      // await new Promise(r => setTimeout(r, 2000));
      GoogleAuth.initialize({
        clientId:
          '171380463934-dp4f3eeus404gvi1bpgdfqditdaqv2mj.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      const savedUser = await user.getUserFromPreferences();
      if (savedUser) {
        const refreshedTokens = await GoogleAuth.refresh();

        if (!user.setUser) {
          console.error('we dont have setuser');
          return;
        }

        user.setUser({
          ...savedUser,
          authentication: refreshedTokens,
        });
        setIsUser(true);
      }
      setLoaded(true);
    });
    // empty dependency array on purpose cause I update user inside
    // so it will trigger the callback for the second time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('deviceready', deviceReadyCallback, false);

    return () => {
      document.removeEventListener('deviceready', deviceReadyCallback);
    };
  }, [deviceReadyCallback]);

  useEffect(() => {
    if (isLoaded)
      document.removeEventListener('deviceready', deviceReadyCallback);
  }, [deviceReadyCallback, isLoaded]);

  if (isLoaded && !isUser) return <Redirect to="/login" />;
  if (isLoaded && isUser) return <Redirect to="/home" />;
  return <Spinner />;
};
