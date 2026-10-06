import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, font, radius } from './theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'neutral';
  style?: ViewStyle;
};

export function BigButton({ label, onPress, variant = 'primary', style }: Props) {
  const bg = {
    primary: colors.primary,
    success: colors.success,
    danger: colors.danger,
    neutral: colors.surface,
  }[variant];
  const fg = variant === 'neutral' ? colors.text : colors.onPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor: variant === 'neutral' ? colors.border : bg,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 96,
    borderRadius: radius,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  label: { fontSize: font.label, fontWeight: '700', textAlign: 'center' },
});