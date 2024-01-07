import { IonModal, IonSpinner, IonText } from '@ionic/react';
import { CSSProperties, ComponentProps, useRef } from 'react';

type WaitToConfigureDeviceModalProps = ComponentProps<typeof IonModal>;

export const WaitToConfigureDeviceModal = ({
  isOpen,
}: WaitToConfigureDeviceModalProps) => {
  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      canDismiss={async (_, role) => role !== 'gesture'}
      backdropDismiss={false}
      initialBreakpoint={1}
      breakpoints={[0, 1]}>
      <div style={styles.waitToConfigureDeviceModalContent}>
        <IonText
          color="dark"
          style={styles.waitToConfigureDeviceModalContentText}>
          Please wait
        </IonText>
        <IonSpinner />
        <IonText
          color="medium"
          style={styles.waitToConfigureDeviceModalContentText}>
          Device is being configured.
        </IonText>
      </div>
    </IonModal>
  );
};

const styles = {
  waitToConfigureDeviceModalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  } as const,
  waitToConfigureDeviceModalContentText: {
    paddingTop: '10px',
    paddingBottom: '10px',
  } as const,
} satisfies Record<string, CSSProperties>;
