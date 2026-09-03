import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenHeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon = 'ellipsis-horizontal',
  onRightPress,
}: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable onPress={onBack} style={styles.iconButton} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      <View style={styles.center}>
        {title ? <Text style={[styles.title, { color: theme.text }]}>{title}</Text> : null}
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={styles.side}>
        {onRightPress ? (
          <Pressable onPress={onRightPress} style={styles.iconButton} hitSlop={8}>
            <Ionicons name={rightIcon} size={20} color={theme.text} />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minHeight: 48,
  },
  side: {
    width: 40,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
