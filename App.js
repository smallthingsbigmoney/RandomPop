import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { useFonts, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

let BannerAd, BannerAdSize, TestIds;
try {
  const ads = require('react-native-google-mobile-ads');
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
  TestIds = ads.TestIds;
} catch (_) {
  BannerAd = null;
}

const AD_UNIT_ID = __DEV__
  ? (TestIds?.BANNER ?? '')
  : 'ca-app-pub-3084145762115882/4914560802';

SplashScreen.preventAutoHideAsync();

const BANNER_H = 60;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SCREEN_FULL_H = Dimensions.get('screen').height;
const IS_PAD = Platform.isPad;
const HAS_HOME_INDICATOR =
  Platform.OS === 'ios' && !IS_PAD && (SCREEN_H >= 812 || SCREEN_W >= 812);
const ANDROID_NAV_H =
  Platform.OS === 'android'
    ? Math.max(SCREEN_FULL_H - SCREEN_H - (RNStatusBar.currentHeight || 0), 48)
    : 0;
const BOTTOM_INSET =
  Platform.OS === 'ios' ? (HAS_HOME_INDICATOR ? 34 : 0) : ANDROID_NAV_H;
const MAX_PLAYERS = IS_PAD ? 11 : 5;
const CIRCLE_R = 70;
const CIRCLE_D = CIRCLE_R * 2;
const CONGRATS_Y = SCREEN_H * 0.13;

const COLOR_POOL = [
  '#FF6B6B', '#6C5CE7', '#00B894', '#FFE66D', '#45B7D1',
  '#E84393', '#4ECDC4', '#E17055', '#A29BFE', '#55EFC4',
  '#FD79A8', '#00CEC9', '#FDCB6E', '#74B9FF', '#96CEB4',
];

const CONFETTI_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#A29BFE', '#FD79A8',
  '#74B9FF', '#55EFC4', '#FDCB6E', '#FF9FF3', '#54A0FF',
];

const CONFETTI_SEEDS = Array.from({ length: 80 }, () => {
  const angle = Math.random() * Math.PI * 2;
  const dist = 120 + Math.random() * 280;
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist + (Math.random() - 0.3) * 60,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 10,
    ratio: 0.5 + Math.random() * 1.0,
    spin: Math.random() * 1080 - 540,
    delay: Math.random() * 0.4,
  };
});

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const tickSound = require('./assets/sounds/tick.wav');
const fanfareSound = require('./assets/sounds/fanfare.wav');

export default function App() {
  const [fontsLoaded] = useFonts({ Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });

  const soundsRef = useRef({ tick: null, fanfare: null });

  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: false });
        const { sound: t } = await Audio.Sound.createAsync(tickSound);
        const { sound: f } = await Audio.Sound.createAsync(fanfareSound);
        soundsRef.current = { tick: t, fanfare: f };
      } catch (_) {}
    })();
    return () => {
      soundsRef.current.tick?.unloadAsync();
      soundsRef.current.fanfare?.unloadAsync();
    };
  }, []);

  const playSound = useCallback(async (name) => {
    try {
      const s = soundsRef.current[name];
      if (!s) return;
      await s.setPositionAsync(0);
      await s.playAsync();
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const touchData   = useRef({});
  const colorIdx    = useRef(0);
  const phaseRef    = useRef('idle');
  const idleTimeout = useRef(null);
  const countIntv   = useRef(null);

  const [, rerender]       = useState(0);
  const [phase, _setPhase] = useState('idle');
  const [countdown, setCd] = useState(null);
  const [winner, setWinner] = useState(null);
  const [frozen, setFrozen] = useState({});

  const expandAnim      = useRef(new Animated.Value(0)).current;
  const pulseAnim       = useRef(new Animated.Value(0)).current;
  const confettiAnim    = useRef(new Animated.Value(0)).current;
  const resultFade      = useRef(new Animated.Value(0)).current;
  const winnerPulseAnim = useRef(new Animated.Value(0)).current;
  const winnerPulseRef  = useRef(null);
  const countdownAnim   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1, duration: 1800,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0, duration: 1800,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    if (countdown == null) return;
    playSound('tick');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    countdownAnim.setValue(0);
    Animated.spring(countdownAnim, {
      toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true,
    }).start();
  }, [countdown]);

  const countdownScale = countdownAnim.interpolate({
    inputRange: [0, 1], outputRange: [1.5, 1.0],
  });
  const countdownOpacity = countdownAnim.interpolate({
    inputRange: [0, 0.3, 1], outputRange: [0.3, 1, 1],
  });
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1], outputRange: [1.0, 1.25],
  });
  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1], outputRange: [0.15, 0.4],
  });

  const kick = useCallback(() => rerender((n) => n + 1), []);

  const setPhase = useCallback((p) => {
    phaseRef.current = p;
    _setPhase(p);
  }, []);

  const allocColor = useCallback(() => {
    const c = COLOR_POOL[colorIdx.current % COLOR_POOL.length];
    colorIdx.current += 1;
    return c;
  }, []);

  const killTimers = useCallback(() => {
    if (idleTimeout.current) { clearTimeout(idleTimeout.current); idleTimeout.current = null; }
    if (countIntv.current) { clearInterval(countIntv.current); countIntv.current = null; }
  }, []);

  const selectWinner = useCallback(() => {
    const ids = Object.keys(touchData.current);
    if (!ids.length) { resetGame(); return; }

    const wId = pick(ids);
    const wt = touchData.current[wId];
    const w = { id: wId, x: wt.x, y: wt.y, color: wt.color };

    const snap = {};
    for (const [id, t] of Object.entries(touchData.current)) {
      snap[id] = { x: t.x, y: t.y, color: t.color };
    }

    setPhase('result');
    setWinner(w);
    setFrozen(snap);
    setCd(null);

    playSound('fanfare');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    expandAnim.setValue(0);
    confettiAnim.setValue(0);
    resultFade.setValue(0);
    winnerPulseAnim.setValue(0);

    Animated.timing(expandAnim, {
      toValue: 1, duration: 2200,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();

    Animated.timing(resultFade, {
      toValue: 1, duration: 400, useNativeDriver: true,
    }).start();

    Animated.timing(confettiAnim, {
      toValue: 1, duration: 1400,
      easing: Easing.out(Easing.cubic), useNativeDriver: true,
    }).start();

    if (winnerPulseRef.current) winnerPulseRef.current.stop();
    winnerPulseRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(winnerPulseAnim, {
          toValue: 1, duration: 900,
          easing: Easing.inOut(Easing.quad), useNativeDriver: true,
        }),
        Animated.timing(winnerPulseAnim, {
          toValue: 0, duration: 900,
          easing: Easing.inOut(Easing.quad), useNativeDriver: true,
        }),
      ])
    );
    winnerPulseRef.current.start();
  }, []);

  const startCountdown = useCallback(() => {
    setPhase('countdown');
    let n = 3;
    setCd(n);
    countIntv.current = setInterval(() => {
      n -= 1;
      setCd(n);
      if (n <= 0) {
        clearInterval(countIntv.current);
        countIntv.current = null;
        selectWinner();
      }
    }, 1000);
  }, []);

  const restartIdle = useCallback(() => {
    killTimers();
    setCd(null);
    if (!Object.keys(touchData.current).length) { setPhase('idle'); return; }
    setPhase('waiting');
    idleTimeout.current = setTimeout(() => {
      idleTimeout.current = null;
      startCountdown();
    }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    killTimers();
    touchData.current = {};
    colorIdx.current = 0;
    setPhase('idle');
    setCd(null);
    setWinner(null);
    setFrozen({});
    expandAnim.setValue(0);
    confettiAnim.setValue(0);
    resultFade.setValue(0);
    if (winnerPulseRef.current) winnerPulseRef.current.stop();
    winnerPulseAnim.setValue(0);
    kick();
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Manual()
        .runOnJS(true)
        .onTouchesDown((event, manager) => {
          if (phaseRef.current === 'result') return;
          for (const touch of event.allTouches) {
            const id = String(touch.id);
            if (touchData.current[id]) continue;
            if (Object.keys(touchData.current).length >= MAX_PLAYERS) break;
            touchData.current[id] = {
              x: touch.absoluteX, y: touch.absoluteY, color: allocColor(),
            };
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          manager.activate();
          kick();
          restartIdle();
        })
        .onTouchesMove((event, manager) => {
          if (phaseRef.current === 'result') return;
          for (const touch of event.allTouches) {
            const id = String(touch.id);
            if (touchData.current[id]) {
              touchData.current[id].x = touch.absoluteX;
              touchData.current[id].y = touch.absoluteY;
            } else if (Object.keys(touchData.current).length < MAX_PLAYERS) {
              touchData.current[id] = {
                x: touch.absoluteX, y: touch.absoluteY, color: allocColor(),
              };
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              kick();
              restartIdle();
            }
          }
          kick();
        })
        .onTouchesUp((event, manager) => {
          const activeIds = new Set(
            event.allTouches
              .filter((t) => !event.changedTouches.some((ct) => ct.id === t.id))
              .map((t) => String(t.id))
          );
          for (const id of Object.keys(touchData.current)) {
            if (!activeIds.has(id)) delete touchData.current[id];
          }
          kick();
          if (phaseRef.current !== 'result') restartIdle();
          if (!Object.keys(touchData.current).length) manager.end();
        })
        .onTouchesCancelled((_event, manager) => manager.end()),
    []
  );

  const liveCircles = Object.entries(touchData.current);

  let maxScale = 1;
  if (winner) {
    const dx = Math.max(winner.x, SCREEN_W - winner.x);
    const dy = Math.max(winner.y, SCREEN_H - winner.y);
    maxScale = (Math.sqrt(dx * dx + dy * dy) / CIRCLE_R) * 1.3;
  }
  const animScale = expandAnim.interpolate({
    inputRange: [0, 1], outputRange: [1, maxScale],
  });

  const renderArrow = () => {
    if (!winner || !frozen[winner.id]) return null;
    const toX = frozen[winner.id].x;
    const toY = frozen[winner.id].y;
    const fromX = SCREEN_W / 2;
    const fromY = CONGRATS_Y + 70;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    return (
      <>
        <Animated.View
          key="line"
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: midX - len / 2, top: midY - 1,
            width: len, height: 2.5,
            backgroundColor: '#FFFFFF', zIndex: 12,
            opacity: resultFade.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7] }),
            transform: [{ rotate: `${angle}rad` }],
          }}
        />
        <Animated.View
          key="head"
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: toX - 10, top: toY - 10,
            width: 0, height: 0,
            borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 18,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderTopColor: '#FFFFFF', zIndex: 12,
            opacity: resultFade,
            transform: [{ rotate: `${angle - Math.PI / 2}rad` }],
          }}
        />
      </>
    );
  };

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar hidden />
      <GestureDetector gesture={gesture}>
        <View style={styles.canvas}>

        {phase === 'result' && winner && (
          <Animated.View
            pointerEvents="none"
            style={[styles.expandBg, {
              backgroundColor: winner.color,
              left: winner.x - CIRCLE_R, top: winner.y - CIRCLE_R,
              transform: [{ scale: animScale }],
            }]}
          />
        )}

        {(phase === 'idle' || phase === 'waiting') && (
          <View style={styles.centered} pointerEvents="none">
            <Text style={styles.prompt}>
              Hold your fingers{'\n'}on the screen
            </Text>
            <Text style={styles.subPrompt}>
              Tap and hold, countdown begins shortly
            </Text>
            <Text style={[styles.subPrompt, { marginTop: 4 }]}>
              Up to {MAX_PLAYERS} players supported
            </Text>
          </View>
        )}

        {phase === 'countdown' && countdown != null && (
          <View style={[styles.centered, { zIndex: 50 }]} pointerEvents="none">
            <Animated.Text
              style={[styles.countdownNum, {
                transform: [{ scale: countdownScale }],
                opacity: countdownOpacity,
              }]}
            >
              {countdown}
            </Animated.Text>
          </View>
        )}

        {phase !== 'result' &&
          liveCircles.map(([id, t]) => (
            <React.Fragment key={id}>
              <Animated.View
                pointerEvents="none"
                style={[styles.circle, {
                  left: t.x - CIRCLE_R, top: t.y - CIRCLE_R,
                  backgroundColor: t.color,
                  opacity: pulseOpacity, transform: [{ scale: pulseScale }],
                }]}
              />
              <View
                pointerEvents="none"
                style={[styles.circle, {
                  left: t.x - CIRCLE_R, top: t.y - CIRCLE_R,
                  backgroundColor: t.color,
                }]}
              />
            </React.Fragment>
          ))}

        {phase === 'result' && winner && frozen[winner.id] && (
          <>
            <View
              pointerEvents="none"
              style={[styles.circle, styles.winnerCircle, {
                left: frozen[winner.id].x - CIRCLE_R,
                top: frozen[winner.id].y - CIRCLE_R,
                backgroundColor: frozen[winner.id].color,
              }]}
            >
              <View style={styles.winnerOverlay} />
            </View>
            <Animated.View
              pointerEvents="none"
              style={[styles.circle, {
                left: frozen[winner.id].x - CIRCLE_R,
                top: frozen[winner.id].y - CIRCLE_R,
                backgroundColor: frozen[winner.id].color,
                zIndex: 11,
                opacity: winnerPulseAnim.interpolate({
                  inputRange: [0, 1], outputRange: [0.5, 0],
                }),
                transform: [{
                  scale: winnerPulseAnim.interpolate({
                    inputRange: [0, 1], outputRange: [1, 1.6],
                  }),
                }],
              }]}
            />
          </>
        )}

        {phase === 'result' && winner && CONFETTI_SEEDS.map((p, i) => {
          const progress = confettiAnim.interpolate({
            inputRange: [0, p.delay * 0.3, Math.min(p.delay * 0.3 + 0.7, 1)],
            outputRange: [0, 0, 1], extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`c-${i}`}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: winner.x - p.size / 2,
                top: winner.y - (p.size * p.ratio) / 2,
                width: p.size, height: p.size * p.ratio,
                backgroundColor: p.color, borderRadius: 3, zIndex: 14,
                opacity: confettiAnim.interpolate({
                  inputRange: [0, 0.05, 0.4, 1], outputRange: [0, 1, 0.8, 0],
                }),
                transform: [
                  { translateX: Animated.multiply(progress, p.dx) },
                  { translateY: Animated.multiply(progress, p.dy) },
                  { rotate: confettiAnim.interpolate({
                    inputRange: [0, 1], outputRange: ['0deg', `${p.spin}deg`],
                  })},
                ],
              }}
            />
          );
        })}

        {phase === 'result' && winner && (
          <Animated.View
            pointerEvents="none"
            style={[styles.congratsWrap, { opacity: resultFade }]}
          >
            <Text style={styles.congratsText}>Congratulate!</Text>
          </Animated.View>
        )}

        {phase === 'result' && renderArrow()}

        {phase === 'result' && (
          <View style={[styles.footer, { bottom: BANNER_H + BOTTOM_INSET + 32 }]} pointerEvents="box-none">
            <TouchableOpacity style={styles.resetBtn} onPress={resetGame} activeOpacity={0.8}>
              <Text style={styles.resetLabel}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}

        </View>
      </GestureDetector>

      <View style={[styles.adBanner, { paddingBottom: BOTTOM_INSET }]}>
        {BannerAd ? (
          <BannerAd
            unitId={AD_UNIT_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        ) : (
          <View style={styles.adPlaceholder}>
            <Text style={styles.adPlaceholderText}>AD BANNER</Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  canvas: { flex: 1, backgroundColor: '#000000' },
  centered: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
  },
  prompt: {
    fontFamily: 'Nunito_700Bold', color: '#FFFFFF',
    fontSize: 34, textAlign: 'center', lineHeight: 48, letterSpacing: 0.3,
  },
  subPrompt: {
    fontFamily: 'Nunito_700Bold', color: '#888888',
    fontSize: 14, textAlign: 'center', marginTop: 12,
  },
  countdownNum: {
    fontFamily: 'Nunito_900Black', color: '#FFFFFF',
    fontSize: 312, position: 'absolute',
  },
  circle: {
    position: 'absolute', width: CIRCLE_D, height: CIRCLE_D,
    borderRadius: CIRCLE_R, justifyContent: 'center',
    alignItems: 'center', overflow: 'visible',
  },
  winnerCircle: { zIndex: 10, overflow: 'hidden' },
  winnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: CIRCLE_R,
  },
  expandBg: {
    position: 'absolute', width: CIRCLE_D, height: CIRCLE_D, borderRadius: CIRCLE_R,
  },
  congratsWrap: {
    position: 'absolute', top: CONGRATS_Y,
    left: 0, right: 0, alignItems: 'center', zIndex: 15,
  },
  congratsText: {
    fontFamily: 'Nunito_800ExtraBold', color: '#FFFFFF', fontSize: 36, letterSpacing: 1,
  },
  footer: {
    position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 20,
  },
  resetBtn: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 40, paddingVertical: 16, borderRadius: 32,
  },
  resetLabel: {
    fontFamily: 'Nunito_900Black', color: '#FFFFFF', fontSize: 22, letterSpacing: 1,
  },
  adBanner: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    alignItems: 'center', backgroundColor: '#000000',
  },
  adPlaceholder: {
    width: '100%', height: BANNER_H, backgroundColor: '#1a1a2e',
    justifyContent: 'center', alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#333',
  },
  adPlaceholderText: { color: '#555', fontSize: 13, letterSpacing: 2 },
});
