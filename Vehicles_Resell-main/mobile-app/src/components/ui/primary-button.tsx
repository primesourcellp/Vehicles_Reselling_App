import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'light' | 'dark';
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, variant = 'light', style }: PrimaryButtonProps) {
  const theme = useTheme();
  const isLight = variant === 'light';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isLight ? '#FFFFFF' : theme.text,
          opacity: pressed ? 0.88 : 1,
        },
        style,
      ]}>
      <Text style={[styles.label, { color: isLight ? theme.text : theme.background }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.pill,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
