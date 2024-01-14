import { IonPage, IonContent, IonText, IonButton } from '@ionic/react';
import { GoogleAuth, User } from '@codetrix-studio/capacitor-google-auth';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

export const LoginPage = () => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const signIn = useCallback(async () => {
    const googleUser = await GoogleAuth.signIn();

    console.debug(googleUser);
    setUser(googleUser);
  }, [setUser]);

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

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Cockpit</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <IonText>Login Page</IonText>
        <IonButton onClick={signIn}>Log In</IonButton>
      </IonContent>
    </IonPage>
  );
};
