import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Radius, Spacing } from '@/constants/theme';

type LoginMethod = 'otp' | 'email' | 'mobile';

const METHODS: { id: LoginMethod; label: string }[] = [
  { id: 'otp', label: 'Mobile OTP' },
  { id: 'email', label: 'Email' },
  { id: 'mobile', label: 'Mobile + PIN' },
];

export default function LoginScreen() {
  const [method, setMethod] = useState<LoginMethod>('otp');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (method === 'otp') {
      if (mobile.replace(/\D/g, '').length < 10) {
        setError('Enter a valid 10-digit mobile number.');
        return;
      }
      setError('');
      router.push({
        pathname: '/verify' as never,
        params: { phone: mobile.trim(), mode: 'login' },
      });
      return;
    }

    if (method === 'email') {
      if (!email.trim() || !password) {
        setError('Enter email and password.');
        return;
      }
      setError('');
      router.replace('/(tabs)/' as never);
      return;
    }

    if (!mobile.trim() || !password) {
      setError('Enter mobile number and password / PIN.');
      return;
    }
    setError('');
    router.replace('/(tabs)/' as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>

            <View style={styles.copy}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Recommended: sign in with mobile number and OTP. Email or mobile with password are
                also available.
              </Text>
            </View>

            <View style={styles.methodRow}>
              {METHODS.map((item) => {
                const active = method === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setMethod(item.id);
                      setError('');
                    }}
                    style={[styles.methodChip, active && styles.methodChipActive]}>
                    <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.form}>
              {method === 'otp' || method === 'mobile' ? (
                <TextInput
                  placeholder="Mobile number"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="phone-pad"
                  value={mobile}
                  onChangeText={setMobile}
                  maxLength={15}
                  style={styles.input}
                />
              ) : null}

              {method === 'email' ? (
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              ) : null}

              {method === 'email' || method === 'mobile' ? (
                <TextInput
                  placeholder="Password / PIN"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              ) : null}

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PrimaryButton
                label={method === 'otp' ? 'Send OTP' : 'Login'}
                onPress={handleLogin}
                style={styles.button}
              />
            </View>

            <Pressable onPress={() => router.replace('/register' as never)} hitSlop={8}>
              <Text style={styles.registerPrompt}>
                New here? <Text style={styles.registerLink}>Create account</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  back: {
    alignSelf: 'flex-start',
  },
  backText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 16,
    fontWeight: '500',
  },
  copy: {
    gap: Spacing.two,
    marginTop: Spacing.two,
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
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  methodChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  methodChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  methodLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '500',
  },
  methodLabelActive: {
    color: '#0A0A0A',
    fontWeight: '600',
  },
  form: {
    gap: Spacing.three,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  error: {
    color: '#F2555A',
    fontSize: 14,
  },
  button: {
    marginTop: Spacing.two,
  },
  registerPrompt: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    textAlign: 'center',
  },
  registerLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
