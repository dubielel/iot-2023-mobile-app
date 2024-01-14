import { IonPage, IonContent, IonText, IonButton } from '@ionic/react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useUserProvider } from '../contexts/UserContext';
import { Redirect } from 'react-router';

export const LoginPage = () => {
  const [isLogged, setIsLogged] = useState(false);
  const user = useUserProvider();

  const signIn = useCallback(async () => {
    const googleUser = await GoogleAuth.signIn();

    if (user.setUser) user.setUser(googleUser);
    user.setUserToPreferences(googleUser);
    setIsLogged(true);

    // send POST to login endpoint on azure
  }, [user]);

  useEffect(() => console.debug(`user: ${JSON.stringify(user)}`), [user]);
  // const { data, error } = useSWR(
  //   'https://iot-project-agh-bcdgl.azurewebsites.net/.auth/login/google/callback',
  //   url =>
  //     fetch(url, {
  //       headers: {
  //         'Access-Control-Allow-Origin': '*',
  //       },
  //     }).then(res => res.json()),
  // );

  // if (error) return <div>Error loading data</div>;
  // if (!data) return <div>Loading...</div>;

  if (isLogged) return <Redirect to="/home" />;
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Cockpit</IonTitle>
        </IonToolbar>
      </IonHeader> */}
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
