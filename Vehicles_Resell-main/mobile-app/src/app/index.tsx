import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Radius, Spacing } from '@/constants/theme';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <View style={[styles.orb, styles.orbOne]} />
        <View style={[styles.orb, styles.orbTwo]} />
        <View style={[styles.orb, styles.orbThree]} />
        <View style={[styles.orb, styles.orbFour]} />
      </View>

      <SafeAreaView style={styles.content}>
        <View style={styles.copy}>
          <Text style={styles.title}>Vehicle Reselling</Text>
          <Text style={styles.subtitle}>
            Buy and sell vehicles easily. Manage listings, track inquiries, and close deals — all
            from one app.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="Get started"
            onPress={() => router.push('/register' as never)}
            style={styles.button}
          />

          <Pressable onPress={() => router.push('/login' as never)} hitSlop={8}>
            <Text style={styles.loginPrompt}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: Radius.pill,
    opacity: 0.55,
  },
  orbOne: {
    width: 280,
    height: 280,
    backgroundColor: '#3A3A3A',
    top: '18%',
    left: '-20%',
  },
  orbTwo: {
    width: 220,
    height: 220,
    backgroundColor: '#555555',
    top: '8%',
    right: '-10%',
  },
  orbThree: {
    width: 340,
    height: 340,
    backgroundColor: '#2A2A2A',
    top: '35%',
    right: '-25%',
  },
  orbFour: {
    width: 180,
    height: 180,
    backgroundColor: '#666666',
    bottom: '30%',
    left: '10%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.five,
  },
  copy: {
    gap: Spacing.two,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  actions: {
    gap: Spacing.three,
  },
  loginPrompt: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  loginLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  button: {
    width: '100%',
  },
});
