import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../theme';
import PrimaryButton from './PrimaryButton';

export default function ModalDialog({ visible, title, message, onClose, onConfirm, confirmText='Done' }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.msg}>{message}</Text> : null}
          <PrimaryButton title={confirmText} onPress={onConfirm || onClose} />
          {onClose && !onConfirm ? (
            <TouchableOpacity onPress={onClose} style={{marginTop:8}}>
              <Text style={{textAlign:'center', color:colors.gray700}}>Close</Text>
            </TouchableOpacity>
          ):null}
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.25)', alignItems:'center', justifyContent:'center' },
  box:{ width:'85%', backgroundColor:colors.white, borderRadius:radius.lg, padding:spacing(2) },
  title:{ fontWeight:'800', fontSize:18, marginBottom:6, color:colors.text },
  msg:{ color:colors.gray700, marginBottom:spacing(1.5) },
});

