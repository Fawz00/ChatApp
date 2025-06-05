import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';

export default function Example() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>

        <Text style={styles.title}>Remember login info?</Text>

        <Text style={styles.subtitle}>
          We'll remember the login info for your account, so you won't need to
          enter it on your iCloud devices.
        </Text>

        <Image
          alt=""
          style={styles.image}
          source={{
            uri: 'https://assets.withfra.me/Permissions.3.png',
          }}
        />

        <Text style={styles.logo}>
          Hey There!
        </Text>

        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}
          style={styles.btn}>
          <Text style={styles.btnText}>Remember</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}
          style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Not now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  image: {
    marginTop: 24,
    alignSelf: 'center',
    width: 350,
    height: 350,
    marginBottom: 'auto',
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBack: {
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    marginLeft: -16,
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
    width: '100%',
    maxWidth: 500,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#C8D3D9',
    marginTop: 12,
    width: '100%',
    maxWidth: 500,
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#1D2A32',
  },

  logo: {
    backgroundColor: 'linear-gradient( 90deg, rgba(17, 26, 115, 1) 50%, rgba(223, 55, 161, 1) 100% )',
    backgroundClip: 'text',
    color: 'transparent',
    fontFamily: "Inter",
    fontSize: 96,
    fontWeight: '400',
  }
});