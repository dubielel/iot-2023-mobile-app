import { IonContent, IonSpinner } from '@ionic/react';
import { CSSProperties } from 'react';

export const Spinner = () => {
  return (
    <IonContent color="light">
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
