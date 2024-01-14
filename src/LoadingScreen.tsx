import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { IonContent, IonSpinner } from '@ionic/react';
import { useState, useCallback, useEffect, CSSProperties } from 'react';
import { Redirect } from 'react-router';

export const LoadingScreen = () => {
  const [isLoaded, setLoaded] = useState(false);

  const deviceReadyCallback = useCallback(() => {
    requestAnimationFrame(async () => {
      // await new Promise(r => setTimeout(r, 2000));
      GoogleAuth.initialize({
        clientId:
          '171380463934-dp4f3eeus404gvi1bpgdfqditdaqv2mj.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      setLoaded(true);
    });
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

  if (isLoaded) return <Redirect to="/login" />;
  return (
    <IonContent>
      <div style={styles.container}>
        <IonSpinner style={styles.spinner} />
      </div>
    </IonContent>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,
  spinner: { width: 64, height: 64 } as const,
} satisfies Record<string, CSSProperties>;
