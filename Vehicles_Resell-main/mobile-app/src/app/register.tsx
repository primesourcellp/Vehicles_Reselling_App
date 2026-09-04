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
import { ApiError } from '@/lib/api';
import { registerAccount } from '@/lib/auth-api';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (loading) return;

    if (
      !fullName.trim() ||
      !mobile.trim() ||
      !email.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pinCode.trim()
    ) {
      setError('Please fill in all required fields.');
      return;
    }
    if (mobile.replace(/\D/g, '').length < 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (pinCode.replace(/\D/g, '').length !== 6) {
      setError('Enter a valid 6-digit PIN code.');
      return;
    }
    if (password || confirmPassword) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await registerAccount({
        full_name: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        city: city.trim(),
        state: state.trim(),
        pin_code: pinCode.trim(),
        password: password || undefined,
        accepted_terms: acceptedTerms,
      });

      router.push({
        pathname: '/verify' as never,
        params: {
          phone: result.mobile,
          email: result.email || email.trim(),
          mode: 'register',
          ...(result.dev_otp ? { devOtp: result.dev_otp } : {}),
        },
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to reach the server. Is the backend running?';
      setError(message);
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>
                Sign up to list vehicles, track inquiries, and close deals. We will email a
                one-time code to verify your address.
              </Text>
            </View>

            <View style={styles.form}>
              <TextInput
                placeholder="Full name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="words"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />
              <TextInput
                placeholder="Mobile number"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={setMobile}
                maxLength={15}
                style={styles.input}
              />
              <TextInput
                placeholder="Email address"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />

              <View style={styles.row}>
                <TextInput
                  placeholder="City"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  autoCapitalize="words"
                  value={city}
                  onChangeText={setCity}
                  style={[styles.input, styles.half]}
                />
                <TextInput
                  placeholder="State"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  autoCapitalize="words"
                  value={state}
                  onChangeText={setState}
                  style={[styles.input, styles.half]}
                />
              </View>

              <TextInput
                placeholder="PIN code"
                placeholderTextColor="rgba(255,255,255,0.4)"
                keyboardType="number-pad"
                value={pinCode}
                onChangeText={setPinCode}
                maxLength={6}
                style={styles.input}
              />
              <Text style={styles.optionalLabel}>
                Password / PIN{' '}
                <Text style={styles.optionalHint}>(optional — for email or mobile login)</Text>
              </Text>
              <TextInput
                placeholder="Password / PIN (optional)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (!value) setConfirmPassword('');
                }}
                style={styles.input}
              />
              {password.length > 0 ? (
                <TextInput
                  placeholder="Confirm password / PIN"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                />
              ) : null}

              <Pressable
                onPress={() => setAcceptedTerms((prev) => !prev)}
                style={styles.termsRow}
                hitSlop={4}>
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.termsText}>
                  I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </Pressable>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PrimaryButton
                label={loading ? 'Sending OTP…' : 'Continue with email OTP'}
                onPress={handleCreateAccount}
                style={styles.button}
              />
            </View>

            <Pressable onPress={() => router.replace('/login' as never)} hitSlop={8}>
              <Text style={styles.loginPrompt}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
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
  form: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  half: {
    flex: 1,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.three,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  optionalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
  optionalHint: {
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '400',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  checkmark: {
    color: '#0A0A0A',
    fontSize: 13,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  error: {
    color: '#F2555A',
    fontSize: 14,
  },
  button: {
    marginTop: Spacing.two,
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
});
