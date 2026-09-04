import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInput as TextInputType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Radius, Spacing } from '@/constants/theme';
import { ApiError } from '@/lib/api';
import {
  requestLoginOtp,
  resendRegisterOtp,
  storeSession,
  verifyLoginOtp,
  verifyRegisterOtp,
} from '@/lib/auth-api';

const CODE_LENGTH = 6;

export default function VerifyScreen() {
  const { phone, mode, email, devOtp } = useLocalSearchParams<{
    phone?: string;
    mode?: string;
    email?: string;
    devOtp?: string;
  }>();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [info, setInfo] = useState(
    typeof devOtp === 'string' && devOtp ? `Dev OTP: ${devOtp}` : '',
  );
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(TextInputType | null)[]>([]);

  const isLogin = mode === 'login';
  const mobile = typeof phone === 'string' ? phone : '';
  const destination =
    (typeof email === 'string' && email.trim()) ||
    mobile ||
    'your email';

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setError('');

    if (digit && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (loading) return;

    const otp = code.join('');
    if (otp.length < CODE_LENGTH) {
      setError('Enter the 6-digit verification code.');
      return;
    }
    if (!mobile) {
      setError('Missing mobile number. Go back and try again.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = isLogin
        ? await verifyLoginOtp(mobile, otp)
        : await verifyRegisterOtp(mobile, otp);
      storeSession(result.tokens);
      router.replace('/(tabs)/' as never);
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

  const handleResend = async () => {
    if (resending || !mobile) return;

    try {
      setResending(true);
      setError('');
      setCode(Array(CODE_LENGTH).fill(''));
      inputs.current[0]?.focus();

      const result = isLogin
        ? await requestLoginOtp(mobile)
        : await resendRegisterOtp(mobile);

      setInfo(
        result.dev_otp
          ? `OTP resent. Dev OTP: ${result.dev_otp}`
          : 'OTP resent to your email.',
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to resend OTP. Check the backend is running.';
      setError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.content}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.copy}>
          <Text style={styles.title}>{isLogin ? 'Verify login' : 'Verify email'}</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit OTP sent to <Text style={styles.phoneHighlight}>{destination}</Text>.
          </Text>
        </View>

        <View style={styles.codeRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) => updateDigit(index, value)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              style={styles.codeInput}
            />
          ))}
        </View>

        {info ? <Text style={styles.info}>{info}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={
            loading
              ? 'Verifying…'
              : isLogin
                ? 'Verify & login'
                : 'Verify & continue'
          }
          onPress={handleVerify}
          style={styles.button}
        />

        <Pressable onPress={handleResend} hitSlop={8} disabled={resending}>
          <Text style={styles.resend}>
            Didn&apos;t get a code?{' '}
            <Text style={styles.resendLink}>{resending ? 'Sending…' : 'Resend OTP'}</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
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
    marginTop: Spacing.three,
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
  phoneHighlight: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  codeInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    backgroundColor: '#1A1A1A',
    borderRadius: Radius.md,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  info: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
  },
  error: {
    color: '#F2555A',
    fontSize: 14,
  },
  button: {
    marginTop: Spacing.one,
  },
  resend: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    textAlign: 'center',
  },
  resendLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
