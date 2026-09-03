import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { StatRow, ViewingCard } from '@/components/ui/dashboard-cards';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { PERIOD_OPTIONS } from '@/constants/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const [period, setPeriod] = useState('Month');

  const listingsCount = 0;
  const dealersCount = 0;
  const viewings: { title: string; time: string; attendees: string[] }[] = [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Pressable style={styles.iconButton} hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={20} color={theme.text} />
        </Pressable>
      </View>

      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: theme.text }]}>Vehicle Reselling</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {listingsCount} vehicles · {dealersCount} dealers
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionHeader title="Upcoming viewings" action="View schedule" />
          {viewings.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {viewings.map((viewing) => (
                <ViewingCard key={viewing.title} {...viewing} />
              ))}
            </ScrollView>
          ) : (
            <EmptyState
              icon="calendar-outline"
              title="No upcoming viewings"
              message="Scheduled test drives and meetings will appear here."
            />
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Sales overview" action="View details" />
          <SegmentedControl options={PERIOD_OPTIONS} selected={period} onSelect={setPeriod} />
          <View style={styles.stats}>
            <StatRow label="Listings" value="0" change={0} />
            <StatRow label="Inquiries" value="0" change={0} />
            <StatRow label="Revenue" value="$0" change={0} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
  },
  headerSpacer: {
    flex: 1,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.five,
  },
  section: {
    gap: Spacing.two,
  },
  stats: {
    marginTop: Spacing.two,
  },
});
