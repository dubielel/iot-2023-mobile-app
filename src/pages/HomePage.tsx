import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage,
  IonRippleEffect,
} from '@ionic/react';
import { CSSProperties } from 'react';

export const HomePage = () => {
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Cockpit</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <div style={styles.cardsWrapper}>
          <IonCard
            routerLink="/device/new"
            className="ion-activatable ripple-parent rounded-rectangle"
            style={styles.card}>
            <IonRippleEffect />
            <IonCardHeader>
              <IonCardTitle style={styles.cardTitle}>
                Configure new device
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            routerLink="/device/add"
            className="ion-activatable ripple-parent rounded-rectangle"
            style={styles.card}>
            <IonRippleEffect />
            <IonCardHeader>
              <IonCardTitle style={styles.cardTitle}>
                Add existing device
              </IonCardTitle>
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
  },
  cardTitle: {
    textAlign: 'center',
  },
} satisfies Record<string, CSSProperties>;
