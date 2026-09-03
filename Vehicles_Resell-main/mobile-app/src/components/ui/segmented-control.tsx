import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SegmentedControlProps = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
};

export function SegmentedControl({ options, selected, onSelect, style }: SegmentedControlProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }, style]}>
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[
              styles.option,
              isActive && { backgroundColor: theme.background, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
            ]}>
            <Text
              style={[
                styles.label,
                { color: isActive ? theme.text : theme.textSecondary },
                isActive && styles.labelActive,
              ]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    padding: Spacing.one,
    gap: Spacing.one,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '600',
  },
});
