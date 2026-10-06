import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { BigButton } from '../ui/BigButton';
import { colors, font, spacing, radius } from '../ui/theme';
import { residentes, medicaciones, citasHoy } from '../data/demo';

const buscar = (id: string) => residentes.find((r) => r.id === id);

export default function PanelCuidadora() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [dadas, setDadas] = useState<string[]>([]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen options={{ title: 'Panel de control' }} />
      <Text style={styles.title}>Turno de mañana</Text>

      <View style={[styles.columns, isTablet && styles.row]}>
        <View style={[styles.column, isTablet && styles.columnTablet]}>
          <Text style={styles.section}>Alertas de medicación</Text>
          {medicaciones.map((m) => {
            const r = buscar(m.residenteId);
            const hecha = dadas.includes(m.id);
            return (
              <View key={m.id} style={[styles.card, hecha && styles.cardDone]}>
                <Text style={styles.cardTitle}>
                  {r?.nombre} (Apt. {r?.apartamento})
                </Text>
                <Text style={styles.cardText}>
                  {m.medicamento} {m.dosis} · {m.hora}
                </Text>
                {hecha ? (
                  <Text style={styles.done}>✓ Administrada</Text>
                ) : (
                  <BigButton
                    label="Marcar administrada"
                    variant="success"
                    onPress={() => setDadas((prev) => [...prev, m.id])}
                    style={styles.small}
                  />
                )}
              </View>
            );
          })}
        </View>

        <View style={[styles.column, isTablet && styles.columnTablet]}>
          <Text style={styles.section}>Citas médicas (hoy)</Text>
          {citasHoy.map((c) => {
            const r = buscar(c.residenteId);
            return (
              <View key={c.id} style={styles.card}>
                <Text style={styles.cardTitle}>{r?.nombre}</Text>
                <Text style={styles.cardText}>
                  {c.especialidad} · {c.hora}
                </Text>
                <Text style={c.acompanante ? styles.badgeWarn : styles.badgeOk}>
                  {c.acompanante ? 'Requiere acompañante' : 'Independiente'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.lg },
  title: { fontSize: font.hero, fontWeight: '800', color: colors.text },
  columns: { gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  column: { gap: spacing.md },
  columnTablet: { flex: 1 },
  section: { fontSize: font.title, fontWeight: '700', color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardDone: { backgroundColor: '#E3F4E8', borderColor: colors.success },
  cardTitle: { fontSize: font.label, fontWeight: '700', color: colors.text },
  cardText: { fontSize: font.body, color: colors.textSoft },
  done: { fontSize: font.body, fontWeight: '700', color: colors.success },
  small: { minHeight: 56 },
  badgeWarn: { fontSize: font.body, fontWeight: '700', color: colors.danger },
  badgeOk: { fontSize: font.body, fontWeight: '700', color: colors.success },
});