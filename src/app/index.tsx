import { ScrollView, Text, View, StyleSheet, useWindowDimensions } from 'react-native';
import { BigButton } from '../ui/BigButton';
import { colors, font, spacing, radius } from '../ui/theme';
import { router } from 'expo-router';

export default function ResidenteInicio() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, isTablet && styles.tablet]}
    >
      <Text style={styles.hello}>Hola, Antonio</Text>

      <View
        style={styles.pillCard}
        accessible
        accessibilityLabel="Próxima pastilla: Sintrom a las 14:00"
      >
        <Text style={styles.pillLabel}>Próxima pastilla</Text>
        <Text style={styles.pillValue}>Sintrom · 14:00 h</Text>
      </View>

      <BigButton
        label="Pedir cita médica"
        onPress={() => router.push('/cita')}
        style={{ minHeight: 140 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  tablet: { maxWidth: 720, width: '100%', alignSelf: 'center', padding: spacing.xl },
  hello: { fontSize: font.hero, fontWeight: '800', color: colors.text },
  pillCard: {
    backgroundColor: colors.alertBg,
    borderRadius: radius,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  pillLabel: { fontSize: font.body, color: colors.textSoft },
  pillValue: { fontSize: font.title, fontWeight: '700', color: colors.text },
});