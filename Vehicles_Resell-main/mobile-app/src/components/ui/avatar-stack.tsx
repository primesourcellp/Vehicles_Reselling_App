import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AvatarStackProps = {
  names: string[];
  size?: number;
};

const AVATAR_COLORS = ['#C4B5A0', '#8B9DC3', '#A8C5A0', '#D4A5A5', '#B5A8D4', '#A0C5C5'];

export function AvatarStack({ names, size = 36 }: AvatarStackProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {names.map((name, index) => (
        <View
          key={name}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
              marginLeft: index === 0 ? 0 : -10,
              borderColor: theme.background,
            },
          ]}>
          <Text style={[styles.initials, { fontSize: size * 0.32 }]}>
            {name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
