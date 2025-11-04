import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing } from '../../theme';

export default function TermsDriver({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>AGREEMENT</Text>
        <Text style={styles.title}>Terms of Service</Text>

        <Text style={styles.sectionH}>1. Transporter Responsibilities</Text>
        <Text style={styles.p}>
          {'\u2022'} Hold a valid driver’s license and required permits.{'\n'}
          {'\u2022'} Keep a roadworthy, insured vehicle.{'\n'}
          {'\u2022'} Accept and complete requests safely and on time.{'\n'}
          {'\u2022'} Keep customer information private.{'\n'}
          {'\u2022'} Use the App only for lawful transport activities.
        </Text>

        <Text style={styles.sectionH}>2. Safety and Conduct</Text>
        <Text style={styles.p}>
          {'\u2022'} You must not transport illegal, hazardous, or restricted items.{'\n'}
          {'\u2022'} Always drive responsibly and follow local regulations.
        </Text>

        <Text style={[styles.p, { marginTop: spacing(1.5), fontStyle: 'italic' }]}>
          Transporter sign-up will be enabled later.
        </Text>
      </ScrollView>

     
           {/* Bottom action bar */}
           <View style={styles.actions}>
             <TouchableOpacity
               onPress={() => navigation.goBack()}
               style={styles.declineBtn}
               activeOpacity={0.8}
             >
               <Text style={styles.declineTxt}>Decline</Text>
             </TouchableOpacity>
     
             <TouchableOpacity
               onPress={() => navigation.goBack()}
               style={styles.acceptBtn}
               activeOpacity={0.8}
             >
               <Text style={styles.acceptTxt}>Accept</Text>
             </TouchableOpacity>
           </View>
         </SafeAreaView>
       );
     }
     
     const styles = StyleSheet.create({
       screen: {
         flex: 1,
         backgroundColor: colors.white,
       },
       content: {
         paddingHorizontal: spacing(2),
         paddingTop: spacing(2),
         paddingBottom: spacing(1),
       },
       kicker: {
         color: colors.gray400 ?? '#9E9E9E',
         textTransform: 'uppercase',
         letterSpacing: 1.2,
         fontWeight: '700',
         marginBottom: spacing(1),
       },
       title: {
         fontSize: 28,
         fontWeight: '800',
         color: colors.primary ?? '#2F80ED', // blue like the mock
         marginBottom: spacing(3),
       },
       sectionH: {
         fontSize: 16,
         fontWeight: '800',
         marginTop: spacing(2),
         marginBottom: spacing(1),
         color: colors.text ?? '#111',
       },
       p: {
         fontSize: 15,
         lineHeight: 24,
         color: colors.gray800 ?? '#444',
       },
     
       actions: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         paddingHorizontal: spacing(2),
         paddingVertical: spacing(2),
       },
     
       declineBtn: {
         flex: 1,
         marginRight: spacing(1),
         borderWidth: 1,
         borderColor: '#EB5757',     // red outline
         backgroundColor: 'transparent',
         borderRadius: 16,
         paddingVertical: spacing(1.75),
         alignItems: 'center',
         justifyContent: 'center',
       },
       declineTxt: {
         fontSize: 16,
         fontWeight: '800',
         color: '#EB5757',
       },
     
       acceptBtn: {
         flex: 1,
         marginLeft: spacing(1),
         backgroundColor: '#27AE60', // green fill
         borderRadius: 16,
         paddingVertical: spacing(1.75),
         alignItems: 'center',
         justifyContent: 'center',
       },
       acceptTxt: {
         fontSize: 16,
         fontWeight: '800',
         color: colors.white,
       },
     });
     