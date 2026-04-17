import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ARScreen from '../screens/ARScreen';
import RecorderScreen from '../screens/RecorderScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: userLoading } = useUser();

  if (authLoading || userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AR" component={ARScreen} />
            {profile?.isAdmin && (
              <Stack.Screen name="Recorder" component={RecorderScreen} />
            )}
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
