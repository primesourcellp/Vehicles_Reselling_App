import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { AvatarStack } from './avatar-stack';

type ViewingCardProps = {
  title: string;
  time: string;
  attendees: string[];
};

export function ViewingCard({ title, time, attendees }: ViewingCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundCard }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.time, { color: theme.textSecondary }]}>{time}</Text>
      <AvatarStack names={attendees} size={28} />
    </View>
  );
}

/** @deprecated Use ViewingCard */
export const MeetingCard = ViewingCard;

type StatRowProps = {
  label: string;
  value: string;
  change: number;
};

export function StatRow({ label, value, change }: StatRowProps) {
  const theme = useTheme();
  const isPositive = change >= 0;
  const color = isPositive ? theme.success : theme.danger;

  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.statRight}>
        <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
        <View style={styles.changeWrap}>
          <Text style={[styles.changeText, { color }]}>
            {isPositive ? '+' : ''}
            {change}%
          </Text>
          <Ionicons name={isPositive ? 'arrow-up' : 'arrow-down'} size={12} color={color} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    marginRight: Spacing.two,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  time: {
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  statLabel: {
    fontSize: 15,
  },
  statRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  changeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 52,
    justifyContent: 'flex-end',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
