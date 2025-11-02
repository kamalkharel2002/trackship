import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function Select({ label, placeholder, value, onChange, options=[] }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: spacing(1.5) }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity onPress={()=>setOpen(true)} activeOpacity={0.8} style={styles.input}>
        <Text style={[styles.value, !value && {color: colors.gray500}]}>
          {value || placeholder || 'Select...'}
        </Text>
        <Text style={styles.chev}>▾</Text>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={()=>setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(it)=>String(it)}
              renderItem={({item})=>(
                <TouchableOpacity
                  onPress={()=>{ onChange(item); setOpen(false); }}
                  style={styles.row}
                >
                  <Text style={{fontSize:16}}>{item}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={()=><View style={{height:1, backgroundColor:colors.border}} />}
            />
            <TouchableOpacity onPress={()=>setOpen(false)} style={styles.cancel}>
              <Text style={{textAlign:'center', color:colors.gray700, fontWeight:'600'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label:{ marginBottom:6, color:colors.text, fontWeight:'700' },
  input:{
    backgroundColor: colors.white,
    borderWidth:1, borderColor:'#B9DFFC',
    borderRadius: radius.md,
    height: 52,
    paddingHorizontal: spacing(1.5),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  value:{ fontSize:16, color:colors.text },
  chev:{ fontSize:18, color:colors.gray700 },
  backdrop:{ flex:1, backgroundColor:'rgba(0,0,0,0.25)', justifyContent:'flex-end' },
  sheet:{ backgroundColor: colors.white, maxHeight: '55%', borderTopLeftRadius:16, borderTopRightRadius:16, overflow:'hidden' },
  row:{ padding:16, backgroundColor:colors.white },
  cancel:{ padding:16, backgroundColor:colors.gray100 }
});
