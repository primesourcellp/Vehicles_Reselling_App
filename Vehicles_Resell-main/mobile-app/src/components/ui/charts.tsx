import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BarChartProps = {
  data: { label: string; value: number }[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
};

export function BarChart({ data, selectedIndex = 0, onSelect }: BarChartProps) {
  const theme = useTheme();

  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 120;
        const isSelected = index === selectedIndex;

        return (
          <Pressable key={item.label} style={styles.barCol} onPress={() => onSelect?.(index)}>
            {isSelected ? (
              <View style={[styles.tooltip, { backgroundColor: theme.text }]}>
                <Text style={[styles.tooltipText, { color: theme.background }]}>
                  ${item.value}
                </Text>
              </View>
            ) : (
              <View style={styles.tooltipSpacer} />
            )}
            <View
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor: isSelected ? theme.chartBarActive : theme.chartBar,
                },
              ]}
            />
            <Text style={[styles.label, { color: theme.textMuted }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type VehicleListingRowProps = {
  name: string;
  role: string;
  score: number;
  change: number;
  color: string;
  price?: string;
};

export function VehicleListingRow({
  name,
  role,
  score,
  change,
  color,
  price,
}: VehicleListingRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Ionicons name="car-sport" size={18} color="#FFFFFF" />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
        <Text style={[styles.role, { color: theme.textSecondary }]}>{role}</Text>
        {price ? (
          <Text style={[styles.price, { color: theme.text }]}>{price}</Text>
        ) : null}
      </View>
      <View style={styles.scoreWrap}>
        <Text style={[styles.score, { color: theme.text }]}>{score}%</Text>
        <Ionicons name="arrow-up" size={12} color={theme.success} />
        <Text style={[styles.change, { color: theme.success }]}>+{change}%</Text>
      </View>
    </View>
  );
}

/** @deprecated Use VehicleListingRow */
export const EmployeeActivityRow = VehicleListingRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingTop: Spacing.three,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tooltip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginBottom: 6,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tooltipSpacer: {
    height: 26,
  },
  bar: {
    width: 24,
    borderRadius: Radius.sm,
    minHeight: 8,
  },
  label: {
    fontSize: 11,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: Spacing.three,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  role: {
    fontSize: 13,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  score: {
    fontSize: 15,
    fontWeight: '600',
  },
  change: {
    fontSize: 12,
    fontWeight: '500',
  },
});
