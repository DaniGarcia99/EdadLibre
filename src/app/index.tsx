import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { BigButton } from '../ui/BigButton';
import { colors, font, radius, spacing } from '../ui/theme';
import { getRol, iniciarSesion } from '../data/auth';
import type { Rol } from '../data/auth';

const irA = (rol: Rol) =>
  router.replace(rol === 'cuidadora' ? '/cuidadora' : '/residente');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Si ya hay sesión iniciada, entra directamente
  useEffect(() => {
    getRol().then((rol) => rol && irA(rol));
  }, []);

  const entrar = async () => {
    setError('');
    setCargando(true);
    try {
      irA(await iniciarSesion(email.trim(), password));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.brand}>EdadLibre</Text>
      <Text style={styles.hello}>Iniciar sesión</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="username"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <BigButton
        label={cargando ? 'Entrando…' : 'Entrar'}
        onPress={entrar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: 'center',
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  brand: { fontSize: font.title, fontWeight: '700', color: colors.primary },
  hello: { fontSize: font.hero, fontWeight: '800', color: colors.text },
  label: { fontSize: font.body, fontWeight: '700', color: colors.text },
  input: {
    minHeight: 64,
    fontSize: font.label,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing.md,
  },
  error: { fontSize: font.body, fontWeight: '700', color: colors.danger },
});