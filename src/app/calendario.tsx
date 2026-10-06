import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { colors, font, spacing, radius } from '../ui/theme';
import type { Cita, Residente } from '../data/demo';
import {
  getCitas,
  getResidentes,
  fechaISO,
  inicioSemana,
  sumarDias,
  nombreDia,
  fechaLarga,
} from '../data/repositorio';

export default function Calendario() {
  const hoy = fechaISO(0);
  const [dia, setDia] = useState(hoy);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [residentes, setResidentes] = useState<Residente[]>([]);

  useEffect(() => {
    getCitas().then(setCitas);
    getResidentes().then(setResidentes);
  }, []);

  const visibles = citas.filter((c) => !filtro || c.residenteId === filtro);
  const delDia = visibles
    .filter((c) => c.fecha === dia)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const lunes = inicioSemana(dia);
  const semana = Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
  const nombre = (id: string) => residentes.find((r) => r.id === id)?.nombre ?? '';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <Stack.Screen options={{ title: 'Calendario de citas' }} />

      {/* Navegación entre semanas */}
      <View style={styles.nav}>
        <Pressable
          style={styles.navBtn}
          accessibilityRole="button"
          onPress={() => setDia(sumarDias(dia, -7))}
        >
          <Text style={styles.navText}>← Semana</Text>
        </Pressable>
        <Pressable
          style={[styles.navBtn, styles.navBtnMain]}
          accessibilityRole="button"
          onPress={() => setDia(hoy)}
        >
          <Text style={[styles.navText, { color: colors.onPrimary }]}>Hoy</Text>
        </Pressable>
        <Pressable
          style={styles.navBtn}
          accessibilityRole="button"
          onPress={() => setDia(sumarDias(dia, 7))}
        >
          <Text style={styles.navText}>Semana →</Text>
        </Pressable>
      </View>

      {/* Franja de la semana: el número es la cantidad de citas */}
      <View style={styles.week}>
        {semana.map((f) => {
          const n = visibles.filter((c) => c.fecha === f).length;
          const activo = f === dia;
          return (
            <Pressable
              key={f}
              accessibilityRole="button"
              accessibilityLabel={`${fechaLarga(f)}, ${n} citas`}
              onPress={() => setDia(f)}
              style={[
                styles.day,
                f === hoy && styles.dayToday,
                activo && styles.dayActive,
              ]}
            >
              <Text style={[styles.dayName, activo && styles.onActive]}>
                {nombreDia(f).slice(0, 3)}
              </Text>
              <Text style={[styles.dayNum, activo && styles.onActive]}>
                {Number(f.slice(8, 10))}
              </Text>
              <Text style={[styles.dayCount, activo && styles.onActive]}>
                {n > 0 ? n : ' '}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Filtro por residente */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filters}>
          <Pressable
            style={[styles.filter, !filtro && styles.filterActive]}
            accessibilityRole="button"
            onPress={() => setFiltro(null)}
          >
            <Text style={[styles.filterText, !filtro && styles.onActive]}>Todos</Text>
          </Pressable>
          {residentes.map((r) => (
            <Pressable
              key={r.id}
              style={[styles.filter, filtro === r.id && styles.filterActive]}
              accessibilityRole="button"
              onPress={() => setFiltro(r.id)}
            >
              <Text style={[styles.filterText, filtro === r.id && styles.onActive]}>
                {r.nombre.split(' ')[0]}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Citas del día */}
      <Text style={styles.dayTitle}>{fechaLarga(dia)}</Text>

      {delDia.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.empty}>No hay citas este día</Text>
        </View>
      ) : (
        delDia.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.hora}>{c.hora}</Text>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.cardTitle}>{nombre(c.residenteId)}</Text>
              <Text style={styles.cardText}>{c.especialidad}</Text>
              <Text style={c.acompanante ? styles.badgeWarn : styles.badgeOk}>
                {c.acompanante ? 'Requiere acompañante' : 'Independiente'}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  nav: { flexDirection: 'row', gap: spacing.sm },
  navBtn: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnMain: { backgroundColor: colors.primary, borderColor: colors.primary },
  navText: { fontSize: 20, fontWeight: '700', color: colors.text },
  week: { flexDirection: 'row', gap: 4 },
  day: {
    flex: 1,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dayToday: { borderColor: colors.primary },
  dayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayName: { fontSize: 16, color: colors.textSoft },
  dayNum: { fontSize: font.label, fontWeight: '800', color: colors.text },
  dayCount: { fontSize: 18, fontWeight: '700', color: colors.danger },
  onActive: { color: colors.onPrimary },
  filters: { flexDirection: 'row', gap: spacing.sm },
  filter: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: font.body, fontWeight: '700', color: colors.text },
  dayTitle: {
    fontSize: font.title,
    fontWeight: '800',
    color: colors.text,
    textTransform: 'capitalize',
    marginTop: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
  },
  hora: { fontSize: font.title, fontWeight: '800', color: colors.primary },
  cardTitle: { fontSize: font.label, fontWeight: '700', color: colors.text },
  cardText: { fontSize: font.body, color: colors.textSoft },
  badgeWarn: { fontSize: font.body, fontWeight: '700', color: colors.danger },
  badgeOk: { fontSize: font.body, fontWeight: '700', color: colors.success },
  empty: { fontSize: font.body, color: colors.textSoft },
});