import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Music, Sparkles, Moon, Star, Mic, Palette } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [heartPulse] = useState(new Animated.Value(1));
  const [sparkleRotate] = useState(new Animated.Value(0));
  const [floatingHearts] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Heart pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.3,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Sparkle rotation
    const sparkleAnimation = Animated.loop(
      Animated.timing(sparkleRotate, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );
    sparkleAnimation.start();

    // Floating hearts animation
    floatingHearts.forEach((anim, index) => {
      const floatAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
        ])
      );
      setTimeout(() => floatAnimation.start(), index * 1000);
    });

    return () => {
      pulseAnimation.stop();
      sparkleAnimation.stop();
    };
  }, []);

  const FloatingIcon = ({ icon: Icon, style, animated = false, animValue }) => (
    <Animated.View 
      style={[
        styles.floatingIcon, 
        style,
        animated && {
          transform: [
            {
              rotate: animValue?.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }) || '0deg'
            }
          ]
        }
      ]}
    >
      <Icon size={28} color="rgba(255, 182, 193, 0.6)" />
    </Animated.View>
  );

  const FloatingHeart = ({ index, style }) => (
    <Animated.View
      style={[
        styles.floatingHeart,
        style,
        {
          opacity: floatingHearts[index]?.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 0.8, 0.3],
          }),
          transform: [
            {
              translateY: floatingHearts[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [20, -20],
              }),
            },
            {
              scale: floatingHearts[index]?.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.2, 0.8],
              }),
            },
          ],
        },
      ]}
    >
      <Heart size={16} color="#FF69B4" fill="#FF69B4" />
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={['#FF1744', '#E91E63', '#9C27B0', '#673AB7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Floating background elements */}
      <FloatingIcon icon={Heart} style={{ top: height * 0.12, left: width * 0.08 }} />
      <FloatingIcon icon={Music} style={{ top: height * 0.2, right: width * 0.12 }} />
      <FloatingIcon 
        icon={Sparkles} 
        style={{ top: height * 0.35, left: width * 0.05 }} 
        animated={true}
        animValue={sparkleRotate}
      />
      <FloatingIcon icon={Moon} style={{ bottom: height * 0.28, right: width * 0.08 }} />
      <FloatingIcon icon={Star} style={{ top: height * 0.45, right: width * 0.2 }} />
      <FloatingIcon icon={Mic} style={{ bottom: height * 0.4, left: width * 0.1 }} />
      <FloatingIcon icon={Palette} style={{ top: height * 0.3, left: width * 0.25 }} />

      {/* Floating hearts */}
      <FloatingHeart index={0} style={{ top: height * 0.15, left: width * 0.3 }} />
      <FloatingHeart index={1} style={{ top: height * 0.6, right: width * 0.25 }} />
      <FloatingHeart index={2} style={{ bottom: height * 0.2, left: width * 0.2 }} />

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo container with app logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ scale: heartPulse }] },
          ]}
        >
          <Image 
            source={require('../../assets/DreamSoul.png')} 
            style={styles.appLogo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* App name with romantic styling */}
        <Text style={styles.appName}>DreamSoul</Text>
        <View style={styles.heartDivider}>
          <Heart size={12} color="#FFB6C1" fill="#FFB6C1" />
          <View style={styles.dividerLine} />
          <Heart size={12} color="#FFB6C1" fill="#FFB6C1" />
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          "First, hear their soul. Then see their art. Finally, dream together."
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Experience authentic love beyond the surface.{'\n'}
          Connect through voice, creativity, and dreams/thoughts.
        </Text>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.replace('MainTabs')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF1744', '#E91E63', '#FF69B4']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Heart size={20} color="#FFFFFF" style={styles.buttonIconLeft} />
              <Text style={styles.primaryButtonText}>Begin Your Love Journey</Text>
              <Sparkles size={18} color="#FFFFFF" style={styles.buttonIconRight} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {/* Handle learn more */}}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Discover the Magic</Text>
            <View style={styles.secondaryButtonIcon}>
              <Star size={16} color="#FFB6C1" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom accent with romantic elements */}
        <View style={styles.bottomAccent}>
          <Heart size={8} color="rgba(255, 182, 193, 0.5)" />
          <View style={styles.accentDot} />
          <View style={[styles.accentDot, styles.accentDotActive]} />
          <View style={styles.accentDot} />
          <Heart size={8} color="rgba(255, 182, 193, 0.5)" />
        </View>
      </Animated.View>

      {/* Enhanced decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      
      {/* Rose petals effect */}
      <View style={styles.rosePetal1} />
      <View style={styles.rosePetal2} />
      <View style={styles.rosePetal3} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.7,
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingHeart: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogo: {
    width: 200,
    height: 200,
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 23, 68, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 2,
  },
  heartDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255, 182, 193, 0.6)',
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFE4E6',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
    fontStyle: 'italic',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 228, 230, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    marginBottom: 16,
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 35,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonIconLeft: {
    marginRight: 12,
  },
  buttonIconRight: {
    marginLeft: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 182, 193, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    color: '#FFE4E6',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButtonIcon: {
    marginLeft: 8,
  },
  bottomAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 182, 193, 0.4)',
    marginHorizontal: 6,
  },
  accentDotActive: {
    backgroundColor: '#FFB6C1',
    width: 28,
    borderRadius: 14,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 182, 193, 0.08)',
    top: -70,
    right: -70,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 105, 180, 0.06)',
    bottom: -50,
    left: -50,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
    top: height * 0.3,
    right: -30,
  },
  rosePetal1: {
    position: 'absolute',
    width: 20,
    height: 30,
    backgroundColor: 'rgba(255, 182, 193, 0.3)',
    borderRadius: 15,
    transform: [{ rotate: '45deg' }],
    top: height * 0.25,
    left: width * 0.15,
  },
  rosePetal2: {
    position: 'absolute',
    width: 16,
    height: 24,
    backgroundColor: 'rgba(255, 105, 180, 0.25)',
    borderRadius: 12,
    transform: [{ rotate: '-30deg' }],
    bottom: height * 0.35,
    right: width * 0.2,
  },
  rosePetal3: {
    position: 'absolute',
    width: 18,
    height: 28,
    backgroundColor: 'rgba(255, 23, 68, 0.2)',
    borderRadius: 14,
    transform: [{ rotate: '60deg' }],
    top: height * 0.5,
    left: width * 0.8,
  },
});

export default WelcomeScreen;