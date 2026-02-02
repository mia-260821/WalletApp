import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const windowHeight = Dimensions.get('window').height;

export default function AnimatedSplashScreen() {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    // Optional: You can explicitly play the animation if autoPlay is false
    // animation.current?.play(); 
  }, []);

  const handleAnimationFinish = () => {
    // Navigate to the dashboard after the animation completes
    // router.replace removes the splash screen from the navigation stack
    router.replace('/onboarding'); 
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.animationContainer}>
        <img src="https://static.vecteezy.com/vite/assets/google-DicjUQvA.svg" width="300px"/>
        <LottieView
          ref={animation}
          style={styles.lottieAnimation}
          source={require('@/assets/animations/wallet-loading.json')} // Update the path to your JSON file
          autoPlay
          loop={false} // Set loop to false so it plays once
          onAnimationFinish={handleAnimationFinish} // Callback when animation ends
        >
        </LottieView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Use your crypto theme color
  },
  animationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 300,
  },
});
