import { ReactNode, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { BigButton } from '../ui/BigButton';
import { colors, font, spacing, radius } from '../ui/theme';
import type { Residente, Medicacion } from '../data/demo';
import { getResidentes, getMedicacion, calcularEdad } from '../data/repositorio';

function Avatar({ nombre, size = 72 }: { nombre: string; size?: number }) {
  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <View
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Text style={[styles.avatarText, { fontSize: size / 2.5 }]}>{iniciales}</Text>
    </View>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

export default function Residentes() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [lista, setLista] = useState<Residente[]>([]);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [medicacion, setMedicacion] = useState<Medicacion[]>([]);

  useEffect(() => {
    getResidentes().then(setLista);
  }, []);

  const actualId = seleccionado ?? (isTablet ? lista[0]?.id ?? null : null);
  const actual = lista.find((r) => r.id === actualId) ?? null;

  useEffect(() => {
    if (actualId) getMedicacion(actualId).then(setMedicacion);
    else setMedicacion([]);
  }, [actualId]);

  const listaUI = (
    <ScrollView contentContainerStyle={styles.listContent}>
      {lista.map((r) => (
        <Pressable
          key={r.id}
          accessibilityRole="button"
          accessibilityLabel={`Ver ficha de ${r.nombre}`}
          onPress={() => setSeleccionado(r.id)}
          style={[styles.row, r.id === actualId && styles.rowActive]}
        >
          <Avatar nombre={r.nombre} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowName}>{r.nombre}</Text>
            <Text style={styles.rowSub}>
              Apt. {r.apartamento} · {r.programa}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );

  const fichaUI = actual && (
    <ScrollView contentContainerStyle={styles.fichaContent}>
      {!isTablet && (
        <BigButton
          label="Volver a la lista"
          variant="neutral"
          onPress={() => setSeleccionado(null)}
          style={styles.small}
        />
      )}

      <View style={styles.header}>
        <Avatar nombre={actual.nombre} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{actual.nombre}</Text>
          <Text style={styles.sub}>
            {calcularEdad(actual.fechaNacimiento)} años · Apt. {actual.apartamento} ·{' '}
            {actual.programa}
          </Text>
        </View>
      </View>

      <Seccion titulo="Alergias">
        {actual.alergias.length ? (
          <View style={styles.chips}>
            {actual.alergias.map((a) => (
              <Text key={a} style={styles.chipAlert}>
                {a}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.text}>Ninguna registrada</Text>
        )}
      </Seccion>

      <Seccion titulo="Patologías">
        {actual.patologias.length ? (
          <View style={styles.chips}>
            {actual.patologias.map((p) => (
              <Text key={p} style={styles.chip}>
                {p}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.text}>Ninguna registrada</Text>
        )}
      </Seccion>

      <Seccion titulo="Medicación">
        {medicacion.length ? (
          medicacion.map((m) => (
            <Text key={m.id} style={styles.text}>
              {m.medicamento} {m.dosis} · {m.hora}
            </Text>
          ))
        ) : (
          <Text style={styles.text}>Sin medicación registrada</Text>
        )}
      </Seccion>

      <Seccion titulo="Necesidades">
        {actual.necesidades.map((n) => (
          <Text key={n} style={styles.text}>
            • {n}
          </Text>
        ))}
      </Seccion>

      <Seccion titulo="Contacto de referencia">
        <Text style={styles.text}>{actual.contacto}</Text>
      </Seccion>
    </ScrollView>
  );

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: 'Residentes' }} />
      {isTablet ? (
        <View style={styles.split}>
          <View style={styles.left}>{listaUI}</View>
          <View style={styles.right}>{fichaUI}</View>
        </View>
      ) : actual ? (
        fichaUI
      ) : (
        listaUI
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  split: { flex: 1, flexDirection: 'row' },
  left: { width: 340, borderRightWidth: 2, borderRightColor: colors.border },
  right: { flex: 1 },
  listContent: { padding: spacing.md, gap: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 84,
  },
  rowActive: { borderColor: colors.primary, backgroundColor: '#E8F1FA' },
  rowName: { fontSize: font.label, fontWeight: '700', color: colors.text },
  rowSub: { fontSize: font.body, color: colors.textSoft },
  fichaContent: { padding: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { fontSize: font.title, fontWeight: '800', color: colors.text },
  sub: { fontSize: font.body, color: colors.textSoft },
  avatar: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.onPrimary, fontWeight: '800' },
  seccion: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  seccionTitulo: { fontSize: font.label, fontWeight: '700', color: colors.text },
  text: { fontSize: font.body, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    fontSize: font.body,
    color: colors.text,
    backgroundColor: '#EEE9DD',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  chipAlert: {
    fontSize: font.body,
    fontWeight: '700',
    color: colors.danger,
    backgroundColor: '#FDE7E5',
    borderWidth: 2,
    borderColor: colors.danger,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  small: { minHeight: 56 },
});