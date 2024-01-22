import { IonPage, IonContent, IonText, IonButton } from '@ionic/react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { useUserProvider } from '../contexts/UserContext';
import { Redirect } from 'react-router';
import { environment as env } from '../../environment';

export const LoginPage = () => {
  const [isLogged, setIsLogged] = useState(false);
  const user = useUserProvider();

  const signIn = useCallback(async () => {
    const googleUser = await GoogleAuth.signIn();

    if (user.setUser) user.setUser(googleUser);
    user.setUserToPreferences(googleUser);
    setIsLogged(true);

    // send GET to login endpoint on azure
    fetch(`${env.AZURE_URL}/api/login`, {
      headers: {
        Authorization: `Bearer ${googleUser.authentication.accessToken}`,
        ...env.AZURE_FUNCTIONS_KEY,
      },
    })
      .then(v => console.debug(v))
      .catch(e => console.error(e));
  }, [user]);

  useEffect(() => console.debug(`user: ${JSON.stringify(user)}`), [user]);

  if (isLogged) return <Redirect to="/home" />;
  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={styles.wrapper}>
          <IonText>Log in with Google to enter application</IonText>
          <IonButton onClick={signIn}>Log In</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  } as const,
} satisfies Record<string, CSSProperties>;
