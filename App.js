

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState('');
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('tasks').then(saved => {
      if (saved) setTasks(JSON.parse(saved));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (value.trim()) {
      setTasks(prev => [
        ...prev,
        { id: Date.now().toString(), name: value.trim(), checked: false },
      ]);
      setValue('');
    }
  };

  const toggleTask = id => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };

  const removeTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => toggleTask(item.id)}
        style={[styles.checkbox, item.checked && styles.checkboxChecked]}
        activeOpacity={0.7}
      >
        {item.checked && <Text style={styles.checkMark}>✔</Text>}
      </TouchableOpacity>

      <Text style={[styles.taskText, item.checked && styles.taskChecked]}>
        {item.name}
      </Text>

      <TouchableOpacity
        onPress={() => removeTask(item.id)}
        style={styles.delBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.delBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.outerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Your Daily To Do</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add new task"
              value={value}
              onChangeText={setValue}
              onSubmitEditing={addTask}
              returnKeyType="done"
              blurOnSubmit={false}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={addTask}
              activeOpacity={0.7}
            >
              <Text style={styles.addBtnText}>＋</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={tasks.filter(t => !t.checked)}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.emptyText}>No pending tasks.</Text>
            }
          />

          {tasks.some(t => t.checked) && (
            <>
              <TouchableOpacity
                onPress={() => setShowDone(!showDone)}
                style={styles.doneToggle}
                activeOpacity={0.7}
              >
                <Text style={styles.doneToggleText}>
                  Done ({tasks.filter(t => t.checked).length}) {showDone ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {showDone && (
                <FlatList
                  data={tasks.filter(t => t.checked)}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                  style={styles.doneList}
                />
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7', // subtle light background for contrast
  },
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
    color: 'darkslategrey',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderColor: 'rgba(47, 79, 79, 0.9)',
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    backgroundColor: '#fafafa',
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: 'rgba(47, 79, 79, 0.9)',
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
    fontWeight: '700',
  },
  list: {
    flexGrow: 0,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(47, 79, 79, 0.3)',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: 'rgba(47, 79, 79, 0.9)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxChecked: {
    backgroundColor: 'rgba(47, 79, 79, 0.9)',
  },
  checkMark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  taskText: {
    flex: 1,
    fontSize: 20,
    color: 'darkslategrey',
  },
  taskChecked: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  delBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
  },
  delBtnText: {
    fontSize: 22,
    color: 'rgba(47, 79, 79, 0.9)',
  },
  doneToggle: {
    alignSelf: 'flex-start',
    backgroundColor: '#d3d3d3',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  doneToggleText: {
    color: 'rgba(47, 79, 79, 0.9)',
    fontWeight: '700',
    fontSize: 18,
  },
  doneList: {
    marginTop: 12,
  },
  emptyText: {
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
  },
});
