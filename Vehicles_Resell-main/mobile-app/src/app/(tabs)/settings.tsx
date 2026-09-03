import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/screen-header';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SETTINGS = [
  'My profile',
  'Notifications',
  'Listing preferences',
  'Payment methods',
  'Privacy & security',
  'Help & support',
];

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Settings" onRightPress={() => undefined} />

      <View style={styles.content}>
        {SETTINGS.map((item) => (
          <View
            key={item}
            style={[styles.row, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.text }]}>{item}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
