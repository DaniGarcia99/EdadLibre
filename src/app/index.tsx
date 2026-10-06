import { StyleSheet, Text, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { BigButton } from '../ui/BigButton';
import { colors, font, spacing } from '../ui/theme';

export default function SeleccionPerfil() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.brand}>EdadLibre</Text>
      <Text style={styles.hello}>Bienvenido</Text>
      <BigButton label="Soy Residente" onPress={() => router.push('/residente')} />
      <BigButton
        label="Soy Cuidadora"
        variant="neutral"
        onPress={() => router.push('/cuidadora')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'center',
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  brand: { fontSize: font.title, fontWeight: '700', color: colors.primary },
  hello: { fontSize: font.hero, fontWeight: '800', color: colors.text },
});