import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarChart } from '@/components/ui/charts';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionHeader } from '@/components/ui/section-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { PERIOD_OPTIONS } from '@/constants/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AnalyticsScreen() {
  const theme = useTheme();
  const [period, setPeriod] = useState('Month');

  const salesData: { label: string; value: number }[] = [];
  const topListings: never[] = [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Analytics"
        showBack={false}
        rightIcon="time-outline"
        onRightPress={() => undefined}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SegmentedControl options={PERIOD_OPTIONS} selected={period} onSelect={setPeriod} />

        <View style={styles.salesHeader}>
          <Text style={[styles.salesValue, { color: theme.text }]}>$0</Text>
        </View>
        <Text style={[styles.salesLabel, { color: theme.textSecondary }]}>
          Total vehicle sales
        </Text>

        {salesData.length > 0 ? (
          <BarChart data={salesData} />
        ) : (
          <EmptyState
            icon="bar-chart-outline"
            title="No sales data yet"
            message="Analytics will appear once you start selling vehicles."
          />
        )}

        <View style={styles.section}>
          <SectionHeader title="Top listings" action="View all" />
          {topListings.length > 0 ? null : (
            <EmptyState
              title="No top listings"
              message="Your best-performing listings will show up here."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.three,
  },
  salesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  salesValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  salesLabel: {
    fontSize: 14,
    marginBottom: Spacing.two,
  },
  section: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
});
