import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
  IonRippleEffect,
} from '@ionic/react';
import { CSSProperties, useCallback, useState } from 'react';
import { useUserProvider } from '../contexts/UserContext';
import { Redirect } from 'react-router';

export const HomePage = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const user = useUserProvider();

  const signOut = useCallback(async () => {
    await GoogleAuth.signOut();

    if (user.setUser) user.setUser(undefined);
    user.removeUserFromPreferences();
    setIsLoggedOut(true);
  }, [user]);

  if (isLoggedOut) return <Redirect to="/login" />;
  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={styles.cardsWrapper}>
          <IonCard
            routerLink="/device/pair"
            className="ion-activatable ripple-parent rounded-rectangle"
            style={styles.card}>
            <IonRippleEffect />
            <IonCardHeader>
              <IonCardTitle style={styles.cardTitle}>Pair device</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            routerLink="/devices"
            className="ion-activatable ripple-parent rounded-rectangle"
            style={styles.card}>
            <IonRippleEffect />
            <IonCardHeader>
              <IonCardTitle style={styles.cardTitle}>List devices</IonCardTitle>
            </IonCardHeader>
          </IonCard>
          {user && (
            <IonCard
              onClick={signOut}
              className="ion-activatable ripple-parent rounded-rectangle"
              style={styles.card}>
              <IonRippleEffect />
              <IonCardHeader>
                <IonCardTitle style={styles.cardTitle}>Log out</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                Currently logged in user: {user.user?.name}
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

const styles = {
  cardsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  card: {
    marginInline: 8,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  cardTitle: {
    textAlign: 'center',
  },
} satisfies Record<string, CSSProperties>;
