import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { BigButton } from '../ui/BigButton';
import { colors, font, spacing, radius } from '../ui/theme';

type Paso = 2 | 3 | 4;

// Cambiar por el teléfono real del centro
const TELEFONO_CENTRO = 'tel:+34000000000';

export default function PedirCita() {
  const [paso, setPaso] = useState<Paso>(2);
  const [acompanante, setAcompanante] = useState<boolean | null>(null);

  const llamar = () => {
    Linking.openURL(TELEFONO_CENTRO);
    router.back();
  };

  const elegirAcompanante = (valor: boolean) => {
    setAcompanante(valor);
    setPaso(4);
  };

  const volver = () => {
    if (paso === 3) setPaso(2);
    else router.back();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen options={{ title: 'Pedir cita' }} />

      <Text style={styles.step}>Paso {paso} de 4</Text>

      {paso === 2 && (
        <>
          <Text style={styles.title}>¿Cómo quieres pedir la cita?</Text>
          <BigButton label="Llamar al centro" variant="neutral" onPress={llamar} />
          <BigButton label="Usar la app" onPress={() => setPaso(3)} />
        </>
      )}

      {paso === 3 && (
        <>
          <Text style={styles.title}>¿Necesitas que tu cuidadora te acompañe?</Text>
          <BigButton label="SÍ" onPress={() => elegirAcompanante(true)} />
          <BigButton label="NO" variant="neutral" onPress={() => elegirAcompanante(false)} />
        </>
      )}

      {paso === 4 && (
        <>
          <View style={styles.card} accessible>
            <Text style={styles.cardTitle}>¡Cita guardada!</Text>
            <Text style={styles.cardText}>Tu cuidadora ya ha sido avisada.</Text>
            <Text style={styles.cardText}>
              {acompanante ? 'Tu cuidadora te acompañará.' : 'Irás por tu cuenta.'}
            </Text>
          </View>
          <BigButton label="Volver al inicio" onPress={() => router.replace('/residente')
        
        
        
        } />
        </>
      )}

      {paso < 4 && <BigButton label="Volver" variant="neutral" onPress={volver} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  step: { fontSize: font.body, color: colors.textSoft },
  title: { fontSize: font.hero, fontWeight: '800', color: colors.text },
  card: {
    backgroundColor: '#E3F4E8',
    borderRadius: radius,
    borderWidth: 2,
    borderColor: colors.success,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTitle: { fontSize: font.hero, fontWeight: '800', color: colors.success },
  cardText: { fontSize: font.title, color: colors.text },
});